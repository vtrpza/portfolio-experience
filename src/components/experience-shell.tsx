import Link from "next/link";
import type { ReactNode } from "react";
import type { Article } from "../../editorial/article";
import { HeroCopy } from "./hero-copy";
import { systemLayers } from "./observatory-controls";
import { SiteNav } from "./site-nav";

type ExperienceShellProps = {
  scene: ReactNode;
  latestArticle?: Pick<Article, "slug" | "title" | "excerpt">;
};

export function ExperienceShell({ scene, latestArticle }: ExperienceShellProps) {
  return (
    <div className="experience-shell">
      <SiteNav />

      <main>
        <div className="experience-main">
          <section className="story-panel" aria-labelledby="home-title">
            <HeroCopy />
          </section>

          <section className="observatory" aria-labelledby="system-atlas-title">
            <header className="scene-heading">
              <div>
                <p>Observatório de sistemas</p>
                <h2 id="system-atlas-title">Um sistema, três camadas.</h2>
              </div>
              <p>Escolha uma camada para ver como ela aparece no trabalho real.</p>
            </header>
            <div className="scene-frame">{scene}</div>
          </section>
        </div>

        <section className="work-rail" aria-label="Evidência profissional">
          <span>Evidência pública</span>
          <dl>
            <div><dt>08+</dt><dd>anos de experiência</dd></div>
            <div><dt>04</dt><dd>MVPs em 18 meses</dd></div>
            <div><dt>10k+</dt><dd>usuários diários em plataformas enterprise</dd></div>
          </dl>
          <Link href="/case-studies/#trajectory">Ver evidências <span aria-hidden="true">→</span></Link>
        </section>

        <section className="home-work" id="trabalhos" aria-labelledby="work-title">
          <header>
            <p className="section-code">Trabalho selecionado</p>
            <h2 id="work-title">Três recortes do mesmo método.</h2>
          </header>
          <div className="home-work-grid">
            {systemLayers.map((layer) => (
              <article key={layer.id}>
                <span>{layer.index} / {layer.label}</span>
                <h3>{layer.project}</h3>
                <p>{layer.summary}</p>
                <p className="home-work-proof"><strong>Prova:</strong> {layer.evidence}</p>
                <Link href={layer.href}>Ver evidência <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>

        {latestArticle ? (
          <section className="home-latest" aria-labelledby="latest-title">
            <div>
              <p className="section-code">Artigo recente</p>
              <h2 id="latest-title">Decisões técnicas com lastro.</h2>
            </div>
            <Link href={`/artigos/${latestArticle.slug}`}>
              <h3>{latestArticle.title}</h3>
              <p>{latestArticle.excerpt}</p>
              <strong>Leia o artigo <span aria-hidden="true">→</span></strong>
            </Link>
          </section>
        ) : null}

        <section className="home-contact" aria-labelledby="home-contact-title">
          <div>
            <p className="section-code">Próximo projeto</p>
            <h2 id="home-contact-title">Tem um produto, integração ou risco para resolver?</h2>
          </div>
          <div>
            <a className="primary-action" href="mailto:vhnpouza@gmail.com">Conversar por e-mail <span aria-hidden="true">↗</span></a>
            <Link className="text-action" href="/about/">Como trabalho</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
