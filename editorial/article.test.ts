import { describe, expect, it } from "vitest";
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
