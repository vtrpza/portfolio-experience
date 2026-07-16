import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveDraft,
  generateArticle,
  generateEvidenceFile,
  generateInstagramPack,
  runCli,
  socialArticleFile,
  verifyPublicSourceUrls,
} from "../scripts/editorial.ts";
import {
  assertAiEligible,
  type Article,
  type EvidencePack,
  validateArticle,
  validateEvidencePack,
  validateInstagramPack,
} from "./article.ts";

const evidence = (overrides: Partial<EvidencePack> = {}): EvidencePack => ({
  id: "rag-experiment",
  titleSeed: "Por que 965 documentos não tornam um RAG pronto",
  kind: "analysis",
  cluster: "ia-aplicada",
  maturity: "verified-experiment",
  ownership: "original",
  privacy: "sanitized",
  aiPolicy: "allowed",
  summary: "O experimento foi revalidado antes da publicação.",
  claims: [{ text: "O corpus tinha 965 documentos.", sourceIds: ["test-1"] }],
  sources: [{ id: "test-1", kind: "test", label: "Teste local", excerpt: "965 documentos verificados." }],
  limitations: ["O resultado vale para este corpus."],
  allowedDomains: [],
  ...overrides,
});

const article = (overrides: Partial<Article> = {}): Article => ({
  slug: "rag-pronto",
  title: "Por que 965 documentos não tornam um RAG pronto",
  metaDescription: "Um experimento com 965 documentos.",
  excerpt: "O corpus tinha 965 documentos.",
  kind: "analysis",
  cluster: "ia-aplicada",
  maturity: "verified-experiment",
  ownership: "original",
  aiDisclosure: "ai-drafted-human-approved",
  blocks: [
    { type: "heading", text: "O experimento", sourceIds: [] },
    { type: "paragraph", text: "O corpus tinha 965 documentos.", sourceIds: ["test-1"] },
  ],
  sources: [{ id: "test-1", title: "Teste local" }],
  limitations: ["O resultado vale para este corpus."],
  publishedAt: "2026-07-15",
  updatedAt: "2026-07-15",
  ...overrides,
});

const modelDraft = {
  title: "Por que 965 documentos não tornam um RAG pronto",
  metaDescription: "Um experimento com 965 documentos.",
  excerpt: "O corpus tinha 965 documentos.",
  blocks: [
    { type: "heading", text: "O experimento", sourceIds: [] },
    { type: "paragraph", text: "O corpus tinha 965 documentos.", sourceIds: ["test-1"] },
  ],
};

const goodAudit = { pass: true, severity: "none", issues: [] };
const temporaryDirectories: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

function temporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "portfolio-editorial-"));
  temporaryDirectories.push(directory);
  return directory;
}

function openAiResponse(
  value: unknown,
  overrides: Record<string, unknown> = {},
): Response {
  return Response.json({
    id: "resp-test",
    status: "completed",
    usage: { input_tokens: 10, output_tokens: 5 },
    output: [{
      type: "message",
      content: [{ type: "output_text", text: JSON.stringify(value) }],
    }],
    ...overrides,
  });
}

function queuedFetch(responses: Response[]) {
  const bodies: Record<string, unknown>[] = [];
  const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    const response = responses.shift();
    if (!response) throw new Error("Unexpected OpenAI call");
    return response;
  }) as unknown as typeof fetch;
  return { bodies, fetcher };
}

describe("editorial contracts", () => {
  it("accepts sanitized evidence whose claims cite known sources", () => {
    expect(validateEvidencePack(evidence())).toEqual([]);
  });

  it.each(["blocked", "permission-required"] as const)("rejects %s evidence", (privacy) => {
    expect(validateEvidencePack(evidence({ privacy }))).not.toEqual([]);
  });

  it("rejects unknown source IDs", () => {
    expect(validateEvidencePack(evidence({ claims: [{ text: "Claim.", sourceIds: ["missing"] }] })).join(" ")).toMatch(/unknown source/i);
  });

  it("rejects an unsourced numerical claim", () => {
    expect(validateEvidencePack(evidence({ claims: [{ text: "Foram 965 documentos.", sourceIds: [] }] })).join(" ")).toMatch(/source/i);
  });

  it("rejects a proposal presented as a delivered case study", () => {
    expect(validateEvidencePack(evidence({ maturity: "proposal", kind: "case-study" })).join(" ")).toMatch(/proposal/i);
  });

  it("rejects first-party authorship language in third-party analysis", () => {
    expect(validateEvidencePack(evidence({ ownership: "third-party-analysis", summary: "Eu construí o produto analisado." })).join(" ")).toMatch(/authorship/i);
  });

  it("blocks every HTB pack from AI generation", () => {
    expect(() => assertAiEligible(evidence({ platform: "htb", aiPolicy: "manual-only" }))).toThrow(/HTB.*manual-only/i);
  });

  it("accepts a valid sourced article", () => {
    expect(validateArticle(article())).toEqual([]);
  });

  it("rejects a factual article block without source IDs", () => {
    expect(validateArticle(article({ blocks: [{ type: "paragraph", text: "O corpus tinha 965 documentos.", sourceIds: [] }] })).join(" ")).toMatch(/cite a source/i);
  });

  it("rejects Instagram source IDs and text absent from the article", () => {
    const errors = validateInstagramPack({
      articleSlug: "rag-pronto",
      hook: "Por que 965 documentos não tornam um RAG pronto",
      caption: "O corpus tinha 965 documentos.",
      slides: [{ title: "O experimento", body: "O corpus tinha 2.000 documentos.", sourceIds: ["new-source"], altText: "Slide textual." }],
      hashtags: ["#rag"],
      cta: "Leia o artigo completo no link da bio.",
    }, article());
    expect(errors.join(" ")).toMatch(/absent|unknown source/i);
  });

  it("enforces the public HTB article gate", () => {
    expect(validateArticle(article({ platform: "htb" })).join(" ")).toMatch(/retired-verified.*retirement.*spoilerLevel.*human-authored/i);
    expect(validateArticle(article({
      platform: "htb",
      contentStatus: "retired-verified",
      retirementVerifiedAt: "2026-07-15",
      spoilerLevel: 0,
      aiDisclosure: "human-authored",
    }))).toEqual([]);
  });
});

describe("editorial AI pipeline", () => {
  it("drafts and audits in two strict, non-stored Responses API calls", async () => {
    const pack = evidence({
      sources: [{
        id: "test-1",
        kind: "public",
        label: "Teste local",
        excerpt: "965 documentos verificados.",
        publicUrl: "https://docs.example.com/evidence/965",
      }],
      allowedDomains: ["example.com"],
    });
    const { bodies, fetcher } = queuedFetch([
      openAiResponse({
        ...modelDraft,
        slug: "model-must-not-control-this",
        sources: [{ id: "invented", title: "Invented" }],
      }),
      openAiResponse(goodAudit),
    ]);
    const runs: unknown[] = [];

    const result = await generateArticle(pack, {
      apiKey: "test-key",
      fetcher,
      now: () => new Date("2026-07-16T02:00:00Z"),
      onRun: (run) => { runs.push(run); },
      verifyPublicUrls: false,
    });

    expect(bodies).toHaveLength(2);
    expect(bodies.every((body) => body.store === false)).toBe(true);
    expect(bodies.every((body) => String(body.instructions).includes("sourceIds"))).toBe(true);
    expect(bodies.every((body) => String(body.instructions).includes("privacy"))).toBe(true);
    expect(bodies.every((body) => String(body.instructions).includes("verificaç"))).toBe(true);
    expect(bodies.every((body) => String(body.instructions).includes("metaDescription"))).toBe(true);
    expect(bodies.every((body) => {
      const format = (body.text as { format: Record<string, unknown> }).format;
      return format.type === "json_schema" && format.strict === true &&
        objectHasStrictSchema(format.schema) && enumsHaveTypes(format.schema);
    })).toBe(true);
    expect(bodies[0]?.model).toBe(process.env.OPENAI_MODEL ?? "gpt-5.6-terra");
    expect(JSON.parse(String(bodies[0]?.input))).toEqual(pack);
    expect(result.article).toMatchObject({
      slug: "por-que-965-documentos-nao-tornam-um-rag-pronto",
      kind: "analysis",
      cluster: "ia-aplicada",
      maturity: "verified-experiment",
      ownership: "original",
      aiDisclosure: "ai-drafted-human-approved",
      sources: [{ id: "test-1", title: "Teste local", url: "https://docs.example.com/evidence/965" }],
      limitations: ["O resultado vale para este corpus."],
      publishedAt: "2026-07-15",
    });
    expect(runs).toEqual([
      { responseId: "resp-test", stage: "draft", inputTokens: 10, outputTokens: 5 },
      { responseId: "resp-test", stage: "audit", inputTokens: 10, outputTokens: 5 },
    ]);
  });

  it("allows one correction and fails closed when the final audit is negative", async () => {
    const { bodies, fetcher } = queuedFetch([
      openAiResponse(modelDraft),
      openAiResponse({ pass: false, severity: "high", issues: ["unsupported claim"] }),
      openAiResponse(modelDraft),
      openAiResponse({ pass: false, severity: "medium", issues: ["still unsupported"] }),
    ]);

    await expect(generateArticle(evidence(), { apiKey: "test-key", fetcher })).rejects.toThrow(
      /final factual audit rejected.*still unsupported/i,
    );
    expect(bodies).toHaveLength(4);
    expect(bodies.filter((body) => JSON.stringify(body.text).includes("correction"))).toHaveLength(1);
  });

  it("fails explicitly on refusals, incomplete responses, timeouts, and invalid JSON", async () => {
    const badRequest = Response.json({
      error: { message: "Invalid schema for response_format 'evidence_article_draft'." },
    }, { status: 400 });
    await expect(generateArticle(evidence(), {
      apiKey: "test-key",
      fetcher: queuedFetch([badRequest]).fetcher,
    })).rejects.toThrow(/status 400.*invalid schema/i);

    const refusal = Response.json({
      id: "resp-refusal",
      status: "completed",
      output: [{ type: "message", content: [{ type: "refusal", refusal: "private reason" }] }],
    });
    await expect(generateArticle(evidence(), {
      apiKey: "test-key",
      fetcher: queuedFetch([refusal]).fetcher,
    })).rejects.toThrow(/refused.*draft/i);

    const incomplete = Response.json({
      id: "resp-incomplete",
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
      output: [],
    });
    await expect(generateArticle(evidence(), {
      apiKey: "test-key",
      fetcher: queuedFetch([incomplete]).fetcher,
    })).rejects.toThrow(/incomplete.*max_output_tokens/i);

    const timeout = vi.fn(async () => {
      throw new DOMException("timed out", "TimeoutError");
    }) as unknown as typeof fetch;
    await expect(generateArticle(evidence(), { apiKey: "test-key", fetcher: timeout })).rejects.toThrow(
      /timed out/i,
    );

    const invalidHttpJson = new Response("{", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    await expect(generateArticle(evidence(), {
      apiKey: "test-key",
      fetcher: queuedFetch([invalidHttpJson]).fetcher,
    })).rejects.toThrow(/invalid HTTP JSON/i);

    const invalidOutputJson = Response.json({
      id: "resp-invalid-output",
      status: "completed",
      output: [{ type: "message", content: [{ type: "output_text", text: "{" }] }],
    });
    await expect(generateArticle(evidence(), {
      apiKey: "test-key",
      fetcher: queuedFetch([invalidOutputJson]).fetcher,
    })).rejects.toThrow(/output was invalid JSON/i);
  });

  it("rejects ineligible evidence before API keys or network", async () => {
    const fetcher = vi.fn(async () => openAiResponse(modelDraft)) as unknown as typeof fetch;
    await expect(generateArticle(evidence({ platform: "htb", aiPolicy: "manual-only" }), {
      apiKey: "",
      fetcher,
    })).rejects.toThrow(/HTB.*manual-only/i);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("fails closed on off-allowlist URLs and optional redirects before the model", async () => {
    const offDomain = evidence({
      sources: [{
        id: "test-1",
        kind: "public",
        label: "Teste local",
        excerpt: "965 documentos verificados.",
        publicUrl: "https://example.net/evidence",
      }],
      allowedDomains: ["example.com"],
    });
    const offDomainFetch = vi.fn(async () => openAiResponse(modelDraft)) as unknown as typeof fetch;
    await expect(generateArticle(offDomain, { apiKey: "test-key", fetcher: offDomainFetch })).rejects.toThrow(
      /not allowed|allowed domain/i,
    );
    expect(offDomainFetch).not.toHaveBeenCalled();

    const allowed = evidence({
      sources: [{
        id: "test-1",
        kind: "public",
        label: "Teste local",
        excerpt: "965 documentos verificados.",
        publicUrl: "https://docs.example.com/evidence",
      }],
      allowedDomains: ["example.com"],
    });
    const redirectFetch = vi.fn(async () => new Response(null, {
      status: 302,
      headers: { location: "https://evil.example.net/evidence" },
    })) as unknown as typeof fetch;
    await expect(verifyPublicSourceUrls(allowed, redirectFetch)).rejects.toThrow(/redirected/i);
    expect(redirectFetch).toHaveBeenCalledTimes(1);
  });
});

describe("editorial file commands", () => {
  it("validate is read-only and generate creates only a private draft", async () => {
    const cwd = temporaryDirectory();
    const evidenceDirectory = join(cwd, "editorial", "evidence");
    mkdirSync(evidenceDirectory, { recursive: true });
    const input = join(evidenceDirectory, "pack.json");
    writeFileSync(input, JSON.stringify(evidence()));
    const validateFetch = vi.fn(async () => openAiResponse(modelDraft)) as unknown as typeof fetch;

    await runCli(["validate", input], { cwd, fetcher: validateFetch, log: vi.fn() });
    expect(validateFetch).not.toHaveBeenCalled();
    expect(existsSync(join(cwd, "editorial", "drafts"))).toBe(false);
    expect(existsSync(join(cwd, "content"))).toBe(false);

    const { fetcher } = queuedFetch([openAiResponse(modelDraft), openAiResponse(goodAudit)]);
    const result = await generateEvidenceFile(input, { cwd, apiKey: "test-key", fetcher });
    expect(existsSync(result.output)).toBe(true);
    expect(existsSync(join(cwd, "content", "articles"))).toBe(false);
  });

  it("approves only drafts with an exact confirmation and never overwrites", async () => {
    const cwd = temporaryDirectory();
    const drafts = join(cwd, "editorial", "drafts");
    mkdirSync(drafts, { recursive: true });
    const draft = join(drafts, "rag-pronto.json");
    writeFileSync(draft, JSON.stringify(article()));

    await expect(approveDraft(draft, { cwd, confirm: async () => "sim" })).rejects.toThrow(
      /confirmation did not match exactly/i,
    );
    expect(existsSync(draft)).toBe(true);
    expect(existsSync(join(cwd, "content", "articles", "rag-pronto.json"))).toBe(false);

    const approved = await approveDraft(draft, {
      cwd,
      confirm: async () => "APROVAR rag-pronto",
      now: () => new Date("2026-07-16T12:00:00Z"),
    });
    expect(existsSync(draft)).toBe(false);
    expect(JSON.parse(readFileSync(approved.output, "utf8"))).toMatchObject({
      slug: "rag-pronto",
      publishedAt: "2026-07-16",
      updatedAt: "2026-07-16",
    });

    writeFileSync(draft, JSON.stringify(article()));
    await expect(approveDraft(draft, {
      cwd,
      confirm: async () => "APROVAR rag-pronto",
    })).rejects.toMatchObject({ code: "EEXIST" });
    expect(existsSync(draft)).toBe(true);
  });

  it("rejects approval and social inputs outside their private/public roots", async () => {
    const cwd = temporaryDirectory();
    const outside = join(cwd, "outside.json");
    mkdirSync(join(cwd, "editorial", "drafts"), { recursive: true });
    mkdirSync(join(cwd, "content", "articles"), { recursive: true });
    writeFileSync(outside, JSON.stringify(article()));

    await expect(approveDraft(outside, {
      cwd,
      confirm: async () => "APROVAR rag-pronto",
    })).rejects.toThrow(/inside/i);
    await expect(socialArticleFile(outside, { cwd, apiKey: "test-key" })).rejects.toThrow(/inside/i);
  });
});

describe("Instagram generation", () => {
  const socialDraft = {
    hook: "Por que 965 documentos não tornam um RAG pronto",
    caption: "O corpus tinha 965 documentos.",
    slides: [{
      title: "O experimento",
      body: "O corpus tinha 965 documentos.",
      sourceIds: ["test-1"],
      altText: "Slide textual sobre o experimento.",
    }],
    hashtags: ["#rag", "#ia"],
  };

  it("sends only the approved Article and does not mutate its file", async () => {
    const cwd = temporaryDirectory();
    const articles = join(cwd, "content", "articles");
    mkdirSync(articles, { recursive: true });
    const input = join(articles, "rag-pronto.json");
    const approved = article();
    writeFileSync(input, `${JSON.stringify(approved, null, 2)}\n`);
    const before = readFileSync(input, "utf8");
    const { bodies, fetcher } = queuedFetch([openAiResponse(socialDraft)]);

    const result = await socialArticleFile(input, { cwd, apiKey: "test-key", fetcher });

    expect(readFileSync(input, "utf8")).toBe(before);
    expect(JSON.parse(String(bodies[0]?.input))).toEqual(approved);
    expect(bodies[0]?.store).toBe(false);
    expect((bodies[0]?.text as { format: Record<string, unknown> }).format).toMatchObject({
      type: "json_schema",
      strict: true,
      schema: {
        properties: {
          hashtags: {
            minItems: 1,
            maxItems: 12,
            items: { pattern: "^#[A-Za-z0-9_]+$" },
          },
        },
      },
    });
    expect(result.pack).toMatchObject({
      articleSlug: "rag-pronto",
      cta: "Leia o artigo completo no link da bio.",
    });
    expect(existsSync(result.output)).toBe(true);
  });

  it("fails the claim and source gates before writing", async () => {
    for (const invalid of [
      { ...socialDraft, caption: "Uma conclusão inventada." },
      { ...socialDraft, slides: [{ ...socialDraft.slides[0], body: "Uma conclusão inventada." }] },
      { ...socialDraft, slides: [{ ...socialDraft.slides[0], sourceIds: ["invented"] }] },
    ]) {
      const { fetcher } = queuedFetch([openAiResponse(invalid)]);
      await expect(generateInstagramPack(article(), { apiKey: "test-key", fetcher })).rejects.toThrow(
        /Instagram pack is invalid/i,
      );
    }
  });

  it("enforces the exact CTA and blocks HTB before keys or network", async () => {
    expect(validateInstagramPack({
      ...socialDraft,
      articleSlug: "rag-pronto",
      cta: "Compre agora.",
    }, article()).join(" ")).toMatch(/cta is invalid/i);

    const fetcher = vi.fn(async () => openAiResponse(socialDraft)) as unknown as typeof fetch;
    await expect(generateInstagramPack(article({
      platform: "htb",
      contentStatus: "retired-verified",
      retirementVerifiedAt: "2026-07-15",
      spoilerLevel: 0,
      aiDisclosure: "human-authored",
    }), { apiKey: "", fetcher })).rejects.toThrow(/HTB content/i);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

function objectHasStrictSchema(value: unknown): boolean {
  return typeof value === "object" && value !== null &&
    (value as Record<string, unknown>).additionalProperties === false;
}

function enumsHaveTypes(value: unknown): boolean {
  if (Array.isArray(value)) return value.every(enumsHaveTypes);
  if (typeof value !== "object" || value === null) return true;
  const schema = value as Record<string, unknown>;
  if (("enum" in schema || "const" in schema) && !("type" in schema)) return false;
  return Object.values(schema).every(enumsHaveTypes);
}
