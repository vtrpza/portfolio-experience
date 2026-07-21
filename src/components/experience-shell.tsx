import Link from "next/link";
import type { Article } from "../../editorial/article";
import { HeroCopy } from "./hero-copy";
import { systemLayers } from "./observatory-controls";
import { SiteNav } from "./site-nav";

type ExperienceShellProps = {
  latestArticle?: Pick<Article, "slug" | "title" | "excerpt">;
};

export function ExperienceShell({ latestArticle }: ExperienceShellProps) {
  return (
    <div className="experience-shell">
      <SiteNav />

      <main id="main-content" className="home-main" tabIndex={-1}>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="story-panel">
            <HeroCopy />
          </div>

          <aside className="hero-proof" aria-labelledby="proof-title">
            <p className="section-code">Evidência em produção</p>
            <h2 id="proof-title">Resultados, não promessas.</h2>
            <dl className="metrics-grid">
              <div>
                <dt>8+</dt>
                <dd>anos de experiência</dd>
              </div>
              <div>
                <dt>4</dt>
                <dd>MVPs entregues em 18 meses</dd>
              </div>
              <div>
                <dt>&gt;10k</dt>
                <dd>usuários diários em produção</dd>
              </div>
            </dl>
            <Link href="/case-studies/#trajectory">
              Ver trajetória <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </section>

        <section className="home-work" id="trabalhos" aria-labelledby="work-title">
          <header className="section-heading">
            <p className="section-code">Trabalho selecionado</p>
            <h2 id="work-title">Decisões que chegam à produção.</h2>
            <p>
              Três problemas diferentes, tratados com o mesmo compromisso:
              entender, construir e provar.
            </p>
          </header>
          <ol className="case-ledger">
            {systemLayers.map((layer) => (
              <li className="case-entry" key={layer.id}>
                <span className="case-index" aria-hidden="true">{layer.index}</span>
                <article aria-labelledby={`case-${layer.id}`}>
                  <header className="case-heading">
                    <p>{layer.label}</p>
                    <h3 id={`case-${layer.id}`}>{layer.project}</h3>
                  </header>
                  <dl className="case-narrative">
                    <div>
                      <dt>Problema</dt>
                      <dd>{layer.problem}</dd>
                    </div>
                    <div>
                      <dt>Decisão</dt>
                      <dd>{layer.summary}</dd>
                    </div>
                    <div>
                      <dt>Prova</dt>
                      <dd>{layer.evidence}</dd>
                    </div>
                  </dl>
                  <a
                    href={layer.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ver evidência de ${layer.project}`}
                  >
                    Ver no GitHub <span aria-hidden="true">↗</span>
                  </a>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="home-method" aria-labelledby="method-title">
          <header className="section-heading">
            <p className="section-code">Método</p>
            <h2 id="method-title">Do problema real à operação confiável.</h2>
          </header>
          <ol className="method-grid">
            <li>
              <span>01 / Definir</span>
              <h3>O problema real</h3>
              <p>Alinho contexto, risco e critério de sucesso antes de escolher a solução.</p>
            </li>
            <li>
              <span>02 / Construir</span>
              <h3>O sistema completo</h3>
              <p>Uno produto, interface, arquitetura, dados e integrações em um fluxo coerente.</p>
            </li>
            <li>
              <span>03 / Produção</span>
              <h3>Confiança para operar</h3>
              <p>Chego à produção com testes, observabilidade, segurança e handoff claro.</p>
            </li>
          </ol>
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
            <h2 id="home-contact-title">Antes do código, uma conversa sobre o problema certo.</h2>
          </div>
          <div>
            <a className="primary-action" href="mailto:vhnpouza@gmail.com">
              Conte o contexto <span aria-hidden="true">↗</span>
            </a>
            <Link className="text-action" href="/about/">Como trabalho</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
