import { mkdir, readFile, realpath, stat, unlink, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";
import {
  assertAiEligible,
  type Article,
  type EvidencePack,
  type InstagramPack,
  validateArticle,
  validateEvidencePack,
  validateInstagramPack,
} from "../editorial/article.ts";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-terra";
const DEFAULT_TIMEOUT_MS = 180_000;
const SOURCE_TIMEOUT_MS = 10_000;
const PUBLICATION_TIME_ZONE = "America/Sao_Paulo";
const CTA = "Leia o artigo completo no link da bio." as const;

const BLOCK_SCHEMA = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "text", "sourceIds"],
      properties: {
        type: { type: "string", enum: ["heading", "paragraph", "callout"] },
        text: { type: "string" },
        sourceIds: { type: "array", items: { type: "string" } },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "items", "sourceIds"],
      properties: {
        type: { type: "string", const: "list" },
        items: { type: "array", minItems: 1, items: { type: "string" } },
        sourceIds: { type: "array", items: { type: "string" } },
      },
    },
  ],
} as const;

const ARTICLE_DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "metaDescription", "excerpt", "blocks"],
  properties: {
    title: { type: "string" },
    metaDescription: { type: "string" },
    excerpt: { type: "string" },
    blocks: { type: "array", minItems: 1, items: BLOCK_SCHEMA },
  },
} as const;

const AUDIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["pass", "severity", "issues"],
  properties: {
    pass: { type: "boolean" },
    severity: { type: "string", enum: ["none", "low", "medium", "high"] },
    issues: { type: "array", items: { type: "string" } },
  },
} as const;

const INSTAGRAM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hook", "caption", "slides", "hashtags"],
  properties: {
    hook: { type: "string" },
    caption: { type: "string" },
    slides: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body", "sourceIds", "altText"],
        properties: {
          title: { type: "string" },
          body: { type: "string" },
          sourceIds: { type: "array", minItems: 1, items: { type: "string" } },
          altText: { type: "string" },
        },
      },
    },
    hashtags: { type: "array", items: { type: "string" } },
  },
} as const;

type JsonObject = Record<string, unknown>;
type Audit = { pass: boolean; severity: "none" | "low" | "medium" | "high"; issues: string[] };

export type GenerationStage = "draft" | "audit" | "correction" | "final-audit" | "social";
export type GenerationRun = {
  responseId: string;
  stage: GenerationStage;
  inputTokens: number;
  outputTokens: number;
};

export type GenerationOptions = {
  apiKey?: string;
  model?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
  now?: () => Date;
  onRun?: (run: GenerationRun) => void | Promise<void>;
  verifyPublicUrls?: boolean;
};

type FileOptions = GenerationOptions & { cwd?: string };
type ApproveOptions = {
  cwd?: string;
  now?: () => Date;
  confirm?: (prompt: string) => Promise<string>;
};
type CliOptions = FileOptions & ApproveOptions & {
  env?: NodeJS.ProcessEnv;
  log?: (message: string) => void;
};

type ResponsesPayload = {
  id?: unknown;
  status?: unknown;
  incomplete_details?: { reason?: unknown } | null;
  usage?: { input_tokens?: unknown; output_tokens?: unknown };
  output?: unknown;
};

async function apiError(response: Response, stage: GenerationStage): Promise<Error> {
  let detail = "";
  try {
    const payload = await response.json() as unknown;
    if (object(payload) && object(payload.error) && typeof payload.error.message === "string") {
      detail = `: ${payload.error.message.replace(/\s+/g, " ").slice(0, 500)}`;
    }
  } catch {
    // The status still identifies the failure when the API body is not JSON.
  }
  return new Error(`OpenAI ${stage} request failed with status ${response.status}${detail}`);
}

function object(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validationError(label: string, errors: string[]): Error {
  return new Error(`${label} is invalid: ${errors.join("; ")}`);
}

function requireEvidence(value: unknown): EvidencePack {
  const errors = validateEvidencePack(value);
  if (errors.length) throw validationError("Evidence pack", errors);
  return value as EvidencePack;
}

function requireArticle(value: unknown): Article {
  const errors = validateArticle(value);
  if (errors.length) throw validationError("Article", errors);
  return value as Article;
}

function requireApiKey(options: GenerationOptions): string {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) throw new Error("OPENAI_API_KEY is required");
  return apiKey;
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error("Evidence titleSeed cannot produce a public slug");
  return slug;
}

function date(options: Pick<GenerationOptions, "now">): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PUBLICATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(options.now?.() ?? new Date());
}

function hostnameAllowed(hostname: string, domains: string[]): boolean {
  const host = hostname.toLowerCase();
  return domains.some((domain) => {
    const allowed = domain.toLowerCase().replace(/\.$/, "");
    return host === allowed || host.endsWith(`.${allowed}`);
  });
}

export function assertPublicSourcePolicy(pack: EvidencePack): void {
  for (const source of pack.sources) {
    if (!source.publicUrl) continue;
    if (source.publicUrl !== source.publicUrl.trim()) {
      throw new Error(`Public source ${source.id} has an invalid URL`);
    }
    const url = new URL(source.publicUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !hostnameAllowed(url.hostname, pack.allowedDomains)
    ) {
      throw new Error(`Public source ${source.id} must use HTTPS on an allowed domain`);
    }
  }
}

function isTimeout(error: unknown, signal: AbortSignal): boolean {
  return signal.aborted || (error instanceof DOMException && ["AbortError", "TimeoutError"].includes(error.name));
}

export async function verifyPublicSourceUrls(
  pack: EvidencePack,
  fetcher: typeof fetch = fetch,
  timeoutMs = SOURCE_TIMEOUT_MS,
): Promise<void> {
  assertPublicSourcePolicy(pack);
  for (const source of pack.sources) {
    if (!source.publicUrl) continue;
    let url = new URL(source.publicUrl);
    let verified = false;
    for (let redirects = 0; redirects < 3; redirects += 1) {
      if (url.protocol !== "https:" || !hostnameAllowed(url.hostname, pack.allowedDomains)) {
        throw new Error(`Public source ${source.id} redirected outside the allowlist`);
      }
      const signal = AbortSignal.timeout(timeoutMs);
      let response: Response;
      try {
        response = await fetcher(url, { method: "GET", redirect: "manual", headers: { range: "bytes=0-0" }, signal });
      } catch (error) {
        if (isTimeout(error, signal)) throw new Error(`Public source ${source.id} verification timed out`);
        throw new Error(`Public source ${source.id} is unavailable`);
      }
      await response.body?.cancel();
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`Public source ${source.id} returned an invalid redirect`);
        url = new URL(location, url);
        continue;
      }
      if (!response.ok) throw new Error(`Public source ${source.id} is unavailable`);
      verified = true;
      break;
    }
    if (!verified) throw new Error(`Public source ${source.id} redirected too many times`);
  }
}

function articleFromDraft(value: unknown, pack: EvidencePack, options: GenerationOptions): Article {
  const draft = object(value) ? value : {};
  const publishedAt = date(options);
  return {
    slug: slugify(pack.titleSeed),
    title: draft.title as string,
    metaDescription: draft.metaDescription as string,
    excerpt: draft.excerpt as string,
    kind: pack.kind,
    cluster: pack.cluster,
    maturity: pack.maturity,
    ownership: pack.ownership,
    aiDisclosure: "ai-drafted-human-approved",
    blocks: draft.blocks as Article["blocks"],
    sources: pack.sources.map((source) => ({
      id: source.id,
      title: source.label,
      ...(source.publicUrl ? { url: source.publicUrl } : {}),
    })),
    limitations: [...pack.limitations],
    publishedAt,
    updatedAt: publishedAt,
  };
}

function audit(value: unknown): Audit {
  if (
    !object(value) ||
    typeof value.pass !== "boolean" ||
    !["none", "low", "medium", "high"].includes(String(value.severity)) ||
    !Array.isArray(value.issues) ||
    !value.issues.every((issue) => typeof issue === "string")
  ) {
    throw new Error("OpenAI audit output did not match its JSON schema");
  }
  return value as Audit;
}

function outputText(payload: ResponsesPayload, stage: GenerationStage): string {
  if (!Array.isArray(payload.output)) throw new Error(`OpenAI ${stage} response did not contain output`);
  let text: string | undefined;
  for (const item of payload.output) {
    if (!object(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (!object(content)) continue;
      if (content.type === "refusal") throw new Error(`OpenAI refused the ${stage} request`);
      if (content.type === "output_text" && typeof content.text === "string") text ??= content.text;
    }
  }
  if (text) return text;
  throw new Error(`OpenAI ${stage} response did not contain output_text`);
}

async function callOpenAI(
  stage: GenerationStage,
  input: unknown,
  instructions: string,
  name: string,
  schema: JsonObject,
  options: GenerationOptions,
  runs: GenerationRun[],
): Promise<unknown> {
  const signal = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (options.fetcher ?? fetch)(OPENAI_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${requireApiKey(options)}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: options.model ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
        store: false,
        instructions,
        input: JSON.stringify(input),
        text: { format: { type: "json_schema", name, strict: true, schema } },
      }),
      signal,
    });
  } catch (error) {
    if (isTimeout(error, signal)) throw new Error(`OpenAI ${stage} request timed out`);
    throw new Error(`OpenAI ${stage} request failed`);
  }
  if (!response.ok) throw await apiError(response, stage);

  let payload: ResponsesPayload;
  try {
    payload = (await response.json()) as ResponsesPayload;
  } catch {
    throw new Error(`OpenAI ${stage} returned invalid HTTP JSON`);
  }
  if (!object(payload) || typeof payload.id !== "string" || typeof payload.status !== "string") {
    throw new Error(`OpenAI ${stage} returned invalid HTTP JSON`);
  }
  if (payload.status === "incomplete") {
    const reason = object(payload.incomplete_details) && typeof payload.incomplete_details.reason === "string"
      ? `: ${payload.incomplete_details.reason}`
      : "";
    throw new Error(`OpenAI ${stage} response was incomplete${reason}`);
  }
  if (payload.status !== "completed") throw new Error(`OpenAI ${stage} response was ${payload.status}`);

  const run = Object.freeze({
    responseId: payload.id,
    stage,
    inputTokens: typeof payload.usage?.input_tokens === "number" ? payload.usage.input_tokens : 0,
    outputTokens: typeof payload.usage?.output_tokens === "number" ? payload.usage.output_tokens : 0,
  });
  runs.push(run);
  await options.onRun?.(run);

  const text = outputText(payload, stage);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`OpenAI ${stage} output was invalid JSON`);
  }
}

function passed(value: Audit): boolean {
  return value.pass && value.severity === "none" && value.issues.length === 0;
}

export async function generateArticle(
  value: unknown,
  options: GenerationOptions = {},
): Promise<{ article: Article; runs: GenerationRun[] }> {
  const pack = requireEvidence(value);
  assertAiEligible(pack);
  assertPublicSourcePolicy(pack);
  requireApiKey(options);
  if (options.verifyPublicUrls !== false) {
    await verifyPublicSourceUrls(pack, options.fetcher ?? fetch);
  }

  const runs: GenerationRun[] = [];
  let article = articleFromDraft(await callOpenAI(
    "draft",
    pack,
    "Redija em português do Brasil usando somente as evidências fornecidas. Não invente fatos. Cada frase factual ou inferência deve ser sustentada pelos sourceIds do próprio bloco. Não exponha hashes ou identificadores internos. Retorne apenas os campos redacionais do schema.",
    "evidence_article_draft",
    ARTICLE_DRAFT_SCHEMA,
    options,
    runs,
  ), pack, options);

  let issues = validateArticle(article);
  if (issues.length === 0) {
    const firstAudit = audit(await callOpenAI(
      "audit",
      { evidence: pack, article },
      "Audite cada frase quanto a factualidade, autoria, privacidade e suporte. Reprove qualquer fato novo e qualquer bloco cujos sourceIds não sustentem todas as suas frases.",
      "evidence_article_audit",
      AUDIT_SCHEMA,
      options,
      runs,
    ));
    if (passed(firstAudit)) return { article, runs };
    issues = firstAudit.issues.length ? firstAudit.issues : [`severity:${firstAudit.severity}`];
  }

  article = articleFromDraft(await callOpenAI(
    "correction",
    { evidence: pack, article, issues },
    "Corrija somente os problemas indicados, sem criar fatos, fontes ou conclusões. Cada frase factual ou inferência deve ser sustentada pelos sourceIds do bloco. Não exponha hashes ou identificadores internos. Retorne apenas os campos redacionais do schema.",
    "evidence_article_correction",
    ARTICLE_DRAFT_SCHEMA,
    options,
    runs,
  ), pack, options);
  if (validateArticle(article).length) throw new Error("Corrected draft failed deterministic validation");

  const finalAudit = audit(await callOpenAI(
    "final-audit",
    { evidence: pack, article },
    "Faça a auditoria factual final frase por frase. Reprove qualquer fato novo, problema de autoria ou privacidade e qualquer bloco cujos sourceIds não sustentem todas as suas frases.",
    "evidence_article_final_audit",
    AUDIT_SCHEMA,
    options,
    runs,
  ));
  if (!passed(finalAudit)) {
    const reasons = finalAudit.issues.length ? finalAudit.issues.join("; ") : `severity:${finalAudit.severity}`;
    throw new Error(`Final factual audit rejected the draft: ${reasons}`);
  }
  return { article, runs };
}

async function readJson(filename: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(filename, "utf8")) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid JSON file: ${filename}`);
    throw error;
  }
}

function within(filename: string, root: string): boolean {
  const path = relative(root, filename);
  return path !== "" && !path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path);
}

async function existingFileWithin(filename: string, root: string, label: string): Promise<string> {
  const [file, directory] = await Promise.all([realpath(filename), realpath(root)]);
  if (!within(file, directory) || !(await stat(file)).isFile()) {
    throw new Error(`${label} must be an existing file inside ${root}`);
  }
  return file;
}

export async function validateEvidenceFile(filename: string, cwd = process.cwd()): Promise<EvidencePack> {
  const pack = requireEvidence(await readJson(resolve(cwd, filename)));
  assertPublicSourcePolicy(pack);
  return pack;
}

export async function generateEvidenceFile(
  filename: string,
  options: FileOptions = {},
): Promise<{ article: Article; runs: GenerationRun[]; output: string }> {
  const cwd = options.cwd ?? process.cwd();
  const pack = await validateEvidenceFile(filename, cwd);
  const result = await generateArticle(pack, options);
  const directory = resolve(cwd, "editorial/drafts");
  const output = resolve(directory, `${result.article.slug}.json`);
  await mkdir(directory, { recursive: true });
  await writeFile(output, `${JSON.stringify(result.article, null, 2)}\n`, { flag: "wx" });
  return { ...result, output };
}

async function terminalConfirmation(prompt: string): Promise<string> {
  const terminal = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await terminal.question(prompt);
  } finally {
    terminal.close();
  }
}

export async function approveDraft(
  filename: string,
  options: ApproveOptions = {},
): Promise<{ article: Article; output: string }> {
  const cwd = options.cwd ?? process.cwd();
  const draftRoot = resolve(cwd, "editorial/drafts");
  const draft = await existingFileWithin(resolve(cwd, filename), draftRoot, "Draft");
  const current = requireArticle(await readJson(draft));
  const expected = `APROVAR ${current.slug}`;
  const answer = await (options.confirm ?? terminalConfirmation)(
    `Digite exatamente "${expected}" para publicar: `,
  );
  if (answer !== expected) throw new Error("Approval cancelled: confirmation did not match exactly");

  const approvedAt = date(options);
  const article = requireArticle({ ...current, publishedAt: approvedAt, updatedAt: approvedAt });
  const directory = resolve(cwd, "content/articles");
  const output = resolve(directory, `${article.slug}.json`);
  await mkdir(directory, { recursive: true });
  await writeFile(output, `${JSON.stringify(article, null, 2)}\n`, { flag: "wx" });
  await unlink(draft);
  return { article, output };
}

export async function generateInstagramPack(
  value: unknown,
  options: GenerationOptions = {},
): Promise<{ pack: InstagramPack; runs: GenerationRun[] }> {
  const article = requireArticle(value);
  if (article.platform === "htb") throw new Error("HTB content cannot enter the social AI pipeline");
  requireApiKey(options);
  const runs: GenerationRun[] = [];
  const result = await callOpenAI(
    "social",
    article,
    "Crie um carrossel curto em português usando somente frases e sourceIds presentes no artigo. Não adicione métricas, histórias, conclusões ou promessas. Hook, legenda, títulos e corpos devem reutilizar texto do artigo. Retorne apenas o schema.",
    "approved_article_instagram",
    INSTAGRAM_SCHEMA,
    options,
    runs,
  );
  const candidate = object(result) ? result : {};
  const pack: InstagramPack = {
    articleSlug: article.slug,
    hook: candidate.hook as string,
    caption: candidate.caption as string,
    slides: candidate.slides as InstagramPack["slides"],
    hashtags: candidate.hashtags as string[],
    cta: CTA,
  };
  const errors = validateInstagramPack(pack, article);
  if (errors.length) throw validationError("Instagram pack", errors);
  return { pack, runs };
}

export async function socialArticleFile(
  filename: string,
  options: FileOptions = {},
): Promise<{ pack: InstagramPack; runs: GenerationRun[]; output: string }> {
  const cwd = options.cwd ?? process.cwd();
  const articleRoot = resolve(cwd, "content/articles");
  const approved = await existingFileWithin(resolve(cwd, filename), articleRoot, "Article");
  const article = requireArticle(await readJson(approved));
  const result = await generateInstagramPack(article, options);
  const directory = resolve(cwd, "content/social/instagram");
  const output = resolve(directory, `${article.slug}.json`);
  await mkdir(directory, { recursive: true });
  await writeFile(output, `${JSON.stringify(result.pack, null, 2)}\n`, { flag: "wx" });
  return { ...result, output };
}

export async function runCli(args: string[], options: CliOptions = {}): Promise<void> {
  const [command, filename, ...extra] = args;
  if (!command || !filename || extra.length) {
    throw new Error("Usage: editorial <validate|generate|approve|social> <file.json>");
  }
  const log = options.log ?? console.log;
  const env = options.env ?? process.env;
  const onRun = options.onRun ?? ((run: GenerationRun) => log(JSON.stringify(run)));
  const generation = {
    ...options,
    apiKey: options.apiKey ?? env.OPENAI_API_KEY,
    model: options.model ?? env.OPENAI_MODEL ?? DEFAULT_MODEL,
    onRun,
  };
  if (command === "validate") {
    await validateEvidenceFile(filename, options.cwd);
    log("Evidence pack is valid.");
    return;
  }
  if (command === "generate") {
    const result = await generateEvidenceFile(filename, generation);
    log(`Draft saved: ${result.output}`);
    return;
  }
  if (command === "approve") {
    const result = await approveDraft(filename, options);
    log(`Article approved: ${result.output}`);
    return;
  }
  if (command === "social") {
    const result = await socialArticleFile(filename, generation);
    log(`Instagram pack saved: ${result.output}`);
    return;
  }
  throw new Error(`Unknown editorial command: ${command}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCli(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Editorial command failed");
    process.exitCode = 1;
  });
}
