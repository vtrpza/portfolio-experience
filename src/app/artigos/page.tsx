import type { Metadata } from "next";
import Link from "next/link";
import { EditorialPage } from "@/components/editorial-page";
import { loadArticles } from "@/lib/articles";
import type { Article } from "../../../editorial/article";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Análises, estudos de caso e notas de campo de Vitor Pouza, sempre ligadas a evidências verificáveis.",
  alternates: { canonical: "/artigos/" },
  openGraph: {
    title: "Artigos — Vitor Pouza",
    description:
      "Engenharia de produto, IA aplicada e segurança explicadas a partir de trabalho real.",
    url: "/artigos/",
  },
};

const clusters: Array<{ id: Article["cluster"]; label: string }> = [
  { id: "ia-aplicada", label: "IA aplicada" },
  { id: "engenharia-de-produto", label: "Engenharia de produto" },
  { id: "seguranca-e-evidencia", label: "Segurança e evidência" },
];

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default function ArticlesPage() {
  const articles = loadArticles();

  return (
    <EditorialPage
      code="Índice / 05"
      eyebrow="Observatório de sistemas"
      title="Trabalho real, explicado com lastro."
      intro="Análises, estudos de caso e notas de campo publicados somente quando afirmações, autoria e limitações podem ser verificadas."
    >
      {articles.length === 0 ? (
        <section className="article-empty" aria-labelledby="article-empty-title">
          <p className="section-code">Em preparação</p>
          <h2 id="article-empty-title">Nenhum artigo aprovado ainda.</h2>
          <p>
            Os primeiros textos estão em revisão factual. Rascunhos não aparecem aqui.
          </p>
        </section>
      ) : (
        <div className="article-clusters">
          {clusters.map((cluster) => {
            const entries = articles.filter((article) => article.cluster === cluster.id);
            if (entries.length === 0) return null;

            return (
              <section className="article-cluster" key={cluster.id}>
                <p className="section-code">{cluster.label}</p>
                <ol className="article-list">
                  {entries.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/artigos/${article.slug}`}>
                        <span>{dateFormatter.format(new Date(article.publishedAt))}</span>
                        <h2>{article.title}</h2>
                        <p>{article.excerpt}</p>
                        <strong>Leia o artigo <span aria-hidden="true">→</span></strong>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      )}
    </EditorialPage>
  );
}
