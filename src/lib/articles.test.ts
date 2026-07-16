import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Article } from "../../editorial/article";
import { loadArticles } from "./articles";

const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

function temporaryDirectory(): string {
  const directory = mkdtempSync(join(process.cwd(), ".articles-test-"));
  directories.push(directory);
  return directory;
}

function article(overrides: Partial<Article> = {}): Article {
  return {
    slug: "artigo",
    title: "Um artigo verificável",
    metaDescription: "Descrição do artigo verificável.",
    excerpt: "Resumo do artigo verificável.",
    kind: "analysis",
    cluster: "ia-aplicada",
    maturity: "verified-experiment",
    ownership: "original",
    aiDisclosure: "human-authored",
    blocks: [
      {
        type: "paragraph",
        text: "Uma afirmação apoiada pela fonte.",
        sourceIds: ["source-1"],
      },
    ],
    sources: [{ id: "source-1", title: "Fonte primária" }],
    limitations: ["Escopo limitado ao experimento."],
    publishedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

function writeArticle(
  directory: string,
  filename: string,
  value: unknown,
): void {
  writeFileSync(join(directory, filename), JSON.stringify(value));
}

describe("loadArticles", () => {
  it("retorna uma lista vazia para diretório ausente ou vazio", () => {
    const directory = temporaryDirectory();

    expect(loadArticles(join(directory, "missing"))).toEqual([]);
    expect(loadArticles(directory)).toEqual([]);
  });

  it("ordena os artigos por publicação mais recente", () => {
    const directory = temporaryDirectory();
    writeArticle(
      directory,
      "antigo.json",
      article({ slug: "antigo", publishedAt: "2026-01-01" }),
    );
    writeArticle(
      directory,
      "recente.json",
      article({
        slug: "recente",
        publishedAt: "2026-02-01",
        updatedAt: "2026-02-01",
      }),
    );

    expect(loadArticles(directory).map(({ slug }) => slug)).toEqual([
      "recente",
      "antigo",
    ]);
  });

  it("rejeita slugs duplicados em arquivos diferentes", () => {
    const directory = temporaryDirectory();
    writeArticle(directory, "primeiro.json", article({ slug: "duplicado" }));
    writeArticle(directory, "segundo.json", article({ slug: "duplicado" }));

    expect(() => loadArticles(directory)).toThrow(
      /duplicate article slug "duplicado"/i,
    );
  });

  it("identifica o arquivo com JSON inválido", () => {
    const directory = temporaryDirectory();
    writeFileSync(join(directory, "quebrado.json"), "{");

    expect(() => loadArticles(directory)).toThrow(/invalid JSON.*quebrado\.json/i);
  });

  it("identifica o arquivo com artigo inválido", () => {
    const directory = temporaryDirectory();
    writeArticle(directory, "invalido.json", {});

    expect(() => loadArticles(directory)).toThrow(
      /invalid article.*invalido\.json/i,
    );
  });
});
