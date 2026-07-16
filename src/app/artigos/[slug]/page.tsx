import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialPage } from "@/components/editorial-page";
import { getArticle, loadArticles } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

const maturityLabels = {
  shipped: "Entregue",
  "verified-experiment": "Experimento verificado",
  prototype: "Protótipo",
  research: "Pesquisa",
  proposal: "Proposta",
  "upstream-analysis": "Análise de projeto upstream",
} as const;

const ownershipLabels = {
  original: "Trabalho original",
  "work-on-upstream": "Trabalho sobre projeto upstream",
  "third-party-analysis": "Análise de terceiro",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});
const emptyBuildSlug = "__empty__";

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  const articles = loadArticles();
  return articles.length > 0
    ? articles.map((article) => ({ slug: article.slug }))
    : [{ slug: emptyBuildSlug }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `/artigos/${article.slug}/`;
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.metaDescription,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["Vitor Pouza"],
    },
  };
}

function References({ sourceIds }: { sourceIds: string[] }) {
  if (sourceIds.length === 0) return null;
  return (
    <span className="source-refs" aria-label="Referências deste trecho">
      {sourceIds.map((id) => (
        <a href={`#source-${id}`} key={id}>[{id}]</a>
      ))}
    </span>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleUrl = `https://vitorpouza.dev/artigos/${article.slug}/`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.cluster,
    mainEntityOfPage: articleUrl,
    author: { "@type": "Person", name: "Vitor Pouza", url: "https://vitorpouza.dev" },
    citation: article.sources.flatMap((source) => source.url ?? []),
  }).replace(/</g, "\\u003c");

  return (
    <EditorialPage
      code="Publicação / Artigo"
      eyebrow="Observatório de sistemas"
      title={article.title}
      intro={article.excerpt}
    >
      <script type="application/ld+json">{jsonLd}</script>

      <dl className="article-meta">
        <div><dt>Estado</dt><dd>{maturityLabels[article.maturity]}</dd></div>
        <div><dt>Autoria</dt><dd>{ownershipLabels[article.ownership]}</dd></div>
        <div><dt>Publicado</dt><dd>{dateFormatter.format(new Date(article.publishedAt))}</dd></div>
        <div>
          <dt>Redação</dt>
          <dd>{article.aiDisclosure === "human-authored" ? "Autoria humana" : "IA redigiu; humano verificou e aprovou"}</dd>
        </div>
      </dl>

      <div className="article-blocks">
        {article.blocks.map((block, index) => {
          const key = `${block.type}-${index}`;
          if (block.type === "heading") {
            return <h2 key={key}>{block.text}<References sourceIds={block.sourceIds} /></h2>;
          }
          if (block.type === "list") {
            return (
              <div className="article-list-block" key={key}>
                <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <References sourceIds={block.sourceIds} />
              </div>
            );
          }
          if (block.type === "callout") {
            return <aside className="article-callout" key={key}>{block.text}<References sourceIds={block.sourceIds} /></aside>;
          }
          return <p key={key}>{block.text}<References sourceIds={block.sourceIds} /></p>;
        })}
      </div>

      <section className="article-limitations" aria-labelledby="limitations-title">
        <p className="section-code">Limitações</p>
        <h2 id="limitations-title">Onde esta conclusão termina.</h2>
        <ul>{article.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
      </section>

      <section className="article-sources" aria-labelledby="sources-title">
        <p className="section-code">Proveniência</p>
        <h2 id="sources-title">Fontes citadas.</h2>
        <ol>
          {article.sources.map((source) => (
            <li id={`source-${source.id}`} key={source.id}>
              <span>[{source.id}]</span>
              {source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> : source.title}
            </li>
          ))}
        </ol>
      </section>

      <footer className="article-actions">
        <Link href="/politica-editorial/">Como estes artigos são produzidos</Link>
        <a className="primary-action" href="mailto:vhnpouza@gmail.com">Conversar sobre o problema <span aria-hidden="true">↗</span></a>
      </footer>
    </EditorialPage>
  );
}
