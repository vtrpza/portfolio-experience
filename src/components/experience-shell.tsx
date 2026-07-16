import type { ReactNode } from "react";
import { HeroCopy } from "./hero-copy";
import { SiteNav } from "./site-nav";

type ExperienceShellProps = {
  scene: ReactNode;
};

export function ExperienceShell({ scene }: ExperienceShellProps) {
  return (
    <div className="experience-shell">
      <SiteNav />

      <main className="experience-main">
        <section className="story-panel" aria-labelledby="portfolio-title">
          <div id="portfolio-title">
            <HeroCopy />
          </div>

          <dl className="practice-index" aria-label="Áreas de atuação">
            <div>
              <dt>01</dt>
              <dd>Produto</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>Plataforma</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>Segurança</dd>
            </div>
          </dl>
        </section>

        <section className="observatory" aria-label="Observatório de sistemas">
          <div className="scene-frame">
            <div className="coordinate coordinate-nw">STACK / 08+ ANOS</div>
            <div className="coordinate coordinate-se">DELIVERY / END-TO-END</div>
            {scene}
          </div>

          <div className="scene-meta">
            <p>
              <span className="status-dot" aria-hidden="true" />
              Mapa procedural / ativo
            </p>
            <p className="interaction-hint">Arraste para orbitar · escolha uma camada</p>
          </div>
        </section>
      </main>

      <aside className="work-rail" aria-label="Provas profissionais">
        <span>Evidência</span>
        <p>
          4 MVPs em 18 meses · sistemas para dezenas de milhares de usuários ·
          segurança com validação.
        </p>
        <span className="work-count">03 / 03</span>
      </aside>
    </div>
  );
}
