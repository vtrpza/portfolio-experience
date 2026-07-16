export type EvidencePack = {
  id: string;
  titleSeed: string;
  kind: "analysis" | "case-study" | "build-log" | "field-note";
  cluster: "ia-aplicada" | "engenharia-de-produto" | "seguranca-e-evidencia";
  maturity: "shipped" | "verified-experiment" | "prototype" | "research" | "proposal" | "upstream-analysis";
  ownership: "original" | "work-on-upstream" | "third-party-analysis";
  privacy: "public" | "sanitized" | "permission-required" | "blocked";
  platform?: "htb";
  aiPolicy: "allowed" | "manual-only" | "blocked";
  summary: string;
  claims: Array<{ text: string; sourceIds: string[] }>;
  sources: Array<{
    id: string;
    kind: "session" | "file" | "test" | "git" | "public";
    label: string;
    excerpt: string;
    publicUrl?: string;
  }>;
  limitations: string[];
  allowedDomains: string[];
};

export type ArticleBlock =
  | { type: "heading" | "paragraph" | "callout"; text: string; sourceIds: string[] }
  | { type: "list"; items: string[]; sourceIds: string[] };

export type Article = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  kind: EvidencePack["kind"];
  cluster: EvidencePack["cluster"];
  maturity: EvidencePack["maturity"];
  ownership: EvidencePack["ownership"];
  aiDisclosure: "ai-drafted-human-approved" | "human-authored";
  blocks: ArticleBlock[];
  sources: Array<{ id: string; title: string; url?: string }>;
  limitations: string[];
  publishedAt: string;
  updatedAt: string;
  platform?: "htb";
  contentStatus?: "retired-verified" | "platform-general";
  retirementVerifiedAt?: string;
  spoilerLevel?: 0;
};

export type InstagramPack = {
  articleSlug: string;
  hook: string;
  caption: string;
  slides: Array<{ title: string; body: string; sourceIds: string[]; altText: string }>;
  hashtags: string[];
  cta: "Leia o artigo completo no link da bio.";
};

type RecordValue = Record<string, unknown>;

const KINDS = ["analysis", "case-study", "build-log", "field-note"] as const;
const CLUSTERS = ["ia-aplicada", "engenharia-de-produto", "seguranca-e-evidencia"] as const;
const MATURITIES = ["shipped", "verified-experiment", "prototype", "research", "proposal", "upstream-analysis"] as const;
const OWNERSHIPS = ["original", "work-on-upstream", "third-party-analysis"] as const;
const SOURCE_KINDS = ["session", "file", "test", "git", "public"] as const;
const PRIVACY = ["public", "sanitized", "permission-required", "blocked"] as const;
const AI_POLICIES = ["allowed", "manual-only", "blocked"] as const;
const ID = /^[A-Za-z0-9_-]{1,64}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/;
const OWN_AUTHORSHIP = /\b(?:eu|nos|nós)\s+(?:criei|criamos|construi|construí|construimos|construímos|desenvolvi|desenvolvemos|entreguei|entregamos|implementei|implementamos)|\b(?:meu|minha|nosso|nossa)\s+(?:projeto|sistema|implementa[cç][aã]o)|\bI\s+(?:built|created|implemented|shipped)\b/i;
const SECRET_OR_PII = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bsk-[A-Za-z0-9_-]{20,}|\bAKIA[0-9A-Z]{16}\b|\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b|\b(?:password|passwd|secret|token|cookie|authorization|bearer|api[_ -]?key|credential|flag)\b\s*[:=]|\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PRIVATE_IP = /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/;

function record(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function oneOf<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

function onlyKeys(value: RecordValue, allowed: readonly string[]): boolean {
  return Object.keys(value).every((key) => allowed.includes(key));
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function allowedHost(url: URL, domains: string[]): boolean {
  return domains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
}

function hasSensitiveMaterial(value: unknown): boolean {
  let serialized: string;
  try { serialized = JSON.stringify(value); } catch { return true; }
  return SECRET_OR_PII.test(serialized) || PRIVATE_IP.test(serialized);
}

export function validateEvidencePack(value: unknown): string[] {
  if (!record(value)) return ["evidence pack must be an object"];
  const errors: string[] = [];
  if (!onlyKeys(value, ["id", "titleSeed", "kind", "cluster", "maturity", "ownership", "privacy", "platform", "aiPolicy", "summary", "claims", "sources", "limitations", "allowedDomains"])) errors.push("evidence pack has unexpected fields");
  if (!text(value.id) || !ID.test(value.id)) errors.push("id is invalid");
  if (!text(value.titleSeed)) errors.push("titleSeed is required");
  if (!oneOf(value.kind, KINDS)) errors.push("kind is invalid");
  if (!oneOf(value.cluster, CLUSTERS)) errors.push("cluster is invalid");
  if (!oneOf(value.maturity, MATURITIES)) errors.push("maturity is invalid");
  if (!oneOf(value.ownership, OWNERSHIPS)) errors.push("ownership is invalid");
  if (!oneOf(value.privacy, PRIVACY)) errors.push("privacy is invalid");
  if (value.privacy === "blocked" || value.privacy === "permission-required") errors.push(`privacy ${value.privacy} is not eligible`);
  if (!oneOf(value.aiPolicy, AI_POLICIES)) errors.push("aiPolicy is invalid");
  if (value.aiPolicy === "blocked") errors.push("aiPolicy blocked is not eligible");
  if (value.platform !== undefined && value.platform !== "htb") errors.push("platform is invalid");
  if (value.platform === "htb" && value.aiPolicy !== "manual-only") errors.push("HTB evidence must be manual-only");
  if (!text(value.summary)) errors.push("summary is required");
  if (value.maturity === "proposal" && value.kind === "case-study") errors.push("proposal cannot be presented as a case-study");

  const domains: string[] = [];
  if (!Array.isArray(value.allowedDomains)) errors.push("allowedDomains must be an array");
  else for (const domain of value.allowedDomains) {
    if (typeof domain !== "string" || !/^(?:[a-z0-9-]+\.)*[a-z0-9-]+$/i.test(domain)) errors.push("allowed domain is invalid");
    else domains.push(domain.toLowerCase());
  }
  if (new Set(domains).size !== domains.length) errors.push("allowedDomains must be unique");

  const sourceIds = new Set<string>();
  if (!Array.isArray(value.sources) || value.sources.length === 0) errors.push("sources are required");
  else for (const source of value.sources) {
    if (!record(source) || !onlyKeys(source, ["id", "kind", "label", "excerpt", "publicUrl"])) { errors.push("source is invalid"); continue; }
    if (!text(source.id) || !ID.test(source.id)) errors.push("source id is invalid");
    else if (sourceIds.has(source.id)) errors.push("source ids must be unique");
    else sourceIds.add(source.id);
    if (!oneOf(source.kind, SOURCE_KINDS) || !text(source.label) || !text(source.excerpt)) errors.push("source is invalid");
    if (source.publicUrl !== undefined) {
      try {
        const url = new URL(String(source.publicUrl));
        if (url.protocol !== "https:" || !allowedHost(url, domains)) errors.push(`source ${String(source.id)} URL is not allowed`);
      } catch { errors.push(`source ${String(source.id)} URL is invalid`); }
    }
  }

  if (!Array.isArray(value.claims) || value.claims.length === 0) errors.push("claims are required");
  else for (const claim of value.claims) {
    if (!record(claim) || !onlyKeys(claim, ["text", "sourceIds"]) || !text(claim.text) || !Array.isArray(claim.sourceIds)) { errors.push("claim is invalid"); continue; }
    if (claim.sourceIds.length === 0) errors.push(/\d/.test(claim.text) ? "numeric claim requires a source" : "claim requires a source");
    for (const id of claim.sourceIds) if (typeof id !== "string" || !sourceIds.has(id)) errors.push(`claim references unknown source ${String(id)}`);
  }

  if (!Array.isArray(value.limitations) || value.limitations.length === 0 || !value.limitations.every(text)) errors.push("limitations are required");
  if (value.ownership === "third-party-analysis" && OWN_AUTHORSHIP.test(`${String(value.titleSeed ?? "")} ${String(value.summary ?? "")} ${JSON.stringify(value.claims ?? [])}`)) errors.push("third-party analysis cannot claim original authorship");
  if (hasSensitiveMaterial(value)) errors.push("evidence contains secret, PII, lab IP, or credential material");
  return [...new Set(errors)];
}

export function validateArticle(value: unknown): string[] {
  if (!record(value)) return ["article must be an object"];
  const errors: string[] = [];
  if (!onlyKeys(value, ["slug", "title", "metaDescription", "excerpt", "kind", "cluster", "maturity", "ownership", "aiDisclosure", "blocks", "sources", "limitations", "publishedAt", "updatedAt", "platform", "contentStatus", "retirementVerifiedAt", "spoilerLevel"])) errors.push("article has unexpected fields");
  if (!text(value.slug) || !SLUG.test(value.slug)) errors.push("slug is invalid");
  if (!text(value.title)) errors.push("title is required");
  if (!text(value.metaDescription)) errors.push("metaDescription is required");
  if (!text(value.excerpt)) errors.push("excerpt is required");
  if (!oneOf(value.kind, KINDS)) errors.push("kind is invalid");
  if (!oneOf(value.cluster, CLUSTERS)) errors.push("cluster is invalid");
  if (!oneOf(value.maturity, MATURITIES)) errors.push("maturity is invalid");
  if (!oneOf(value.ownership, OWNERSHIPS)) errors.push("ownership is invalid");
  if (value.aiDisclosure !== "ai-drafted-human-approved" && value.aiDisclosure !== "human-authored") errors.push("aiDisclosure is invalid");
  if (value.maturity === "proposal" && value.kind === "case-study") errors.push("proposal cannot be presented as a case-study");
  if (!text(value.publishedAt) || !DATE.test(value.publishedAt) || Number.isNaN(Date.parse(value.publishedAt))) errors.push("publishedAt is invalid");
  if (!text(value.updatedAt) || !DATE.test(value.updatedAt) || Number.isNaN(Date.parse(value.updatedAt))) errors.push("updatedAt is invalid");
  if (typeof value.publishedAt === "string" && typeof value.updatedAt === "string" && Date.parse(value.updatedAt) < Date.parse(value.publishedAt)) errors.push("updatedAt cannot precede publishedAt");

  const sourceIds = new Set<string>();
  if (!Array.isArray(value.sources) || value.sources.length === 0) errors.push("sources are required");
  else for (const source of value.sources) {
    if (!record(source) || !onlyKeys(source, ["id", "title", "url"]) || !text(source.id) || !ID.test(source.id) || !text(source.title)) { errors.push("source is invalid"); continue; }
    if (sourceIds.has(source.id)) errors.push("source ids must be unique");
    sourceIds.add(source.id);
    if (source.url !== undefined) {
      try { if (new URL(String(source.url)).protocol !== "https:") errors.push(`source ${source.id} must use https`); }
      catch { errors.push(`source ${source.id} URL is invalid`); }
    }
  }

  if (!Array.isArray(value.blocks) || value.blocks.length === 0) errors.push("blocks are required");
  else for (const block of value.blocks) {
    if (!record(block) || !oneOf(block.type, ["heading", "paragraph", "callout", "list"] as const) || !Array.isArray(block.sourceIds)) { errors.push("block is invalid"); continue; }
    const content = block.type === "list"
      ? Array.isArray(block.items) && block.items.length > 0 && block.items.every(text)
      : text(block.text);
    if (!content) errors.push("block is invalid");
    if (!onlyKeys(block, block.type === "list" ? ["type", "items", "sourceIds"] : ["type", "text", "sourceIds"])) errors.push("block has unexpected fields");
    for (const id of block.sourceIds) if (typeof id !== "string" || !sourceIds.has(id)) errors.push(`block references unknown source ${String(id)}`);
    if (block.type !== "heading" && block.sourceIds.length === 0) errors.push("factual block must cite a source with sourceIds");
    const body = block.type === "list" && Array.isArray(block.items) ? block.items.join(" ") : String(block.text ?? "");
    if (/\d/.test(body) && block.sourceIds.length === 0) errors.push("numeric block requires sourceIds");
  }

  if (!Array.isArray(value.limitations) || value.limitations.length === 0 || !value.limitations.every(text)) errors.push("limitations are required");
  if (value.ownership === "third-party-analysis" && OWN_AUTHORSHIP.test(`${String(value.title ?? "")} ${String(value.excerpt ?? "")} ${JSON.stringify(value.blocks ?? [])}`)) errors.push("third-party analysis cannot claim original authorship");

  if (value.platform === "htb") {
    if (value.contentStatus === "platform-general") {
      if (value.retirementVerifiedAt !== undefined || value.spoilerLevel !== 0 || value.aiDisclosure !== "human-authored") errors.push("General HTB article requires platform-general, no retirementVerifiedAt, spoilerLevel 0, and human-authored");
    } else if (value.contentStatus !== "retired-verified" || !text(value.retirementVerifiedAt) || !DATE.test(value.retirementVerifiedAt) || value.spoilerLevel !== 0 || value.aiDisclosure !== "human-authored") {
      errors.push("HTB article requires retired-verified, retirementVerifiedAt, spoilerLevel 0, and human-authored");
    }
  } else if (value.platform !== undefined || value.contentStatus !== undefined || value.retirementVerifiedAt !== undefined || value.spoilerLevel !== undefined) {
    errors.push("HTB-only fields require platform htb");
  }
  if (hasSensitiveMaterial(value)) errors.push("article contains secret, PII, lab IP, or credential material");
  return [...new Set(errors)];
}

export function validateInstagramPack(pack: unknown, article: Article): string[] {
  if (!record(pack)) return ["Instagram pack must be an object"];
  const errors: string[] = [];
  if (!onlyKeys(pack, ["articleSlug", "hook", "caption", "slides", "hashtags", "cta"])) errors.push("Instagram pack has unexpected fields");
  if (pack.articleSlug !== article.slug) errors.push("articleSlug does not match approved article");
  if (!text(pack.hook) || !text(pack.caption)) errors.push("hook and caption are required");
  if (pack.cta !== "Leia o artigo completo no link da bio.") errors.push("CTA is invalid");
  if (!Array.isArray(pack.hashtags) || pack.hashtags.length === 0 || pack.hashtags.length > 12 || !pack.hashtags.every((tag) => typeof tag === "string" && /^#[\p{L}\p{N}_]+$/u.test(tag))) errors.push("hashtags are invalid");
  if (article.platform === "htb") errors.push("HTB social generation is manual-only");

  const articleSources = new Set(article.sources.map((source) => source.id));
  const supported = article.blocks.flatMap((block) => {
    const values = block.type === "list" ? block.items : [block.text];
    return values.map((value) => ({ value: normalize(value), sourceIds: new Set(block.sourceIds) }));
  });
  const supportedCopy = [
    article.title,
    article.metaDescription,
    article.excerpt,
    ...article.limitations,
    ...supported.map((entry) => entry.value),
  ].map(normalize);
  for (const field of ["hook", "caption"] as const) {
    if (text(pack[field]) && !pack[field]
      .split(/[.!?\n]+/)
      .map(normalize)
      .filter(Boolean)
      .every((part) => supportedCopy.some((allowed) => allowed.includes(part)))) {
      errors.push(`${field} introduces text absent from the article`);
    }
  }
  if (!Array.isArray(pack.slides) || pack.slides.length === 0) errors.push("slides are required");
  else for (const slide of pack.slides) {
    if (!record(slide) || !onlyKeys(slide, ["title", "body", "sourceIds", "altText"]) || !text(slide.title) || !text(slide.body) || !text(slide.altText) || !Array.isArray(slide.sourceIds)) { errors.push("slide is invalid"); continue; }
    for (const id of slide.sourceIds) if (typeof id !== "string" || !articleSources.has(id)) errors.push(`slide references unknown source ${String(id)}`);
    const body = normalize(slide.body);
    const matches = supported.filter((entry) => entry.value.includes(body));
    if (matches.length === 0) errors.push("slide introduces a claim absent from the article");
    else for (const id of slide.sourceIds) if (!matches.some((entry) => entry.sourceIds.has(String(id)))) errors.push(`slide source ${String(id)} does not support its body`);
    if (/\d/.test(slide.body) && slide.sourceIds.length === 0) errors.push("numeric slide requires sourceIds");
  }
  const articleNumbers = new Set(JSON.stringify(article).match(/\d+(?:[.,]\d+)?/g) ?? []);
  for (const number of `${String(pack.hook ?? "")} ${String(pack.caption ?? "")}`.match(/\d+(?:[.,]\d+)?/g) ?? []) if (!articleNumbers.has(number)) errors.push("social copy introduces a number absent from the article");
  if (hasSensitiveMaterial(pack)) errors.push("Instagram pack contains secret, PII, lab IP, or credential material");
  return [...new Set(errors)];
}

export function assertAiEligible(pack: EvidencePack): void {
  const errors = validateEvidencePack(pack);
  if (errors.length > 0) throw new Error(`Evidence pack rejected: ${errors.join("; ")}`);
  if (pack.platform === "htb") throw new Error("HTB machine-specific content is manual-only and cannot enter the AI pipeline");
  if (pack.aiPolicy !== "allowed") throw new Error(`AI policy ${pack.aiPolicy} does not allow generation`);
}
