import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/articles", () => ({
  loadArticles: () => [{ slug: "artigo-aprovado", updatedAt: "2026-07-15" }],
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("inclui rotas públicas e artigos aprovados sem duplicidade", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://vitorpouza.dev/");
    expect(urls).toContain("https://vitorpouza.dev/artigos/");
    expect(urls).toContain("https://vitorpouza.dev/politica-editorial/");
    expect(urls).toContain("https://vitorpouza.dev/artigos/artigo-aprovado/");
    expect(urls).not.toContain("https://vitorpouza.dev/workana/");
    expect(new Set(urls).size).toBe(urls.length);
  });
});
