import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Trabalhos",
  description:
    "Projetos públicos e recortes de experiência de Vitor Pouza em produto, plataforma e segurança.",
  alternates: { canonical: "/case-studies/" },
};

const cases = [
  {
    index: "01",
    area: "Produto próprio",
    title: "Repo Pulse — descoberta técnica guiada por evidência.",
    summary:
      "Radar que encontra repositórios públicos para uma necessidade concreta e compara candidatos por sinais verificáveis.",
    context:
      "A busca do GitHub entrega volume, mas comparar adequação, atividade e maturidade ainda exige abrir muitos projetos e reconstruir o contexto manualmente.",
    decision:
      "Uma busca filtrável por linguagem, tópico, atividade, estrelas, licença e forks, com radares prontos e um sinal comparativo de 0 a 100. O Worker concentra o acesso ao GitHub e o D1 preserva snapshots.",
    evidence:
      "Next.js 16 via Vinext, React 19, TypeScript, Cloudflare Worker, Drizzle e D1. Testes cobrem consulta, perfis de tendência, sinal comparativo e HTML renderizado.",
    result:
      "A aplicação está publicada com busca, ranking ajustável e histórico real de estrelas e forks. O cache em D1 mantém o último snapshot disponível quando o GitHub falha.",
    id: "repo-pulse",
    href: "https://github.com/vtrpza/repo-pulse",
    linkLabel: "Inspecionar o Repo Pulse",
    tags: ["Produto", "Next.js", "Cloudflare", "D1"],
  },
  {
    index: "02",
    area: "Aquisição orgânica",
    title: "Blog VR — operação editorial em produção.",
    summary:
      "Plataforma para publicar conteúdo jurídico com fontes verificáveis e conectar aquisição orgânica à operação comercial.",
    context:
      "Conteúdo jurídico exige velocidade sem abrir mão de fontes, linguagem responsável, rastreabilidade e proteção dos dados enviados por potenciais clientes.",
    decision:
      "Worker SSR em TypeScript, sem framework front-end ou CMS. D1 mantém o estado editorial, Workflows orquestram pesquisa e redação com IA, e quality gates determinísticos bloqueiam conteúdo fora das regras.",
    evidence:
      "Domínio próprio na Cloudflare, fontes oficiais por allowlist, publicação atômica, sitemap e canônicos; formulário protegido por Turnstile, rate limit e idempotência antes do Pipedrive.",
    result:
      "O blog está em produção com páginas temáticas e artigos publicados. Conteúdo reprovado não ocupa vaga de publicação, e integrações críticas falham de forma fechada.",
    id: "blog-vr",
    href: "https://github.com/vtrpza/blog-vr",
    linkLabel: "Inspecionar o Blog VR",
    tags: ["Cloudflare Workers", "TypeScript", "D1", "Workflows"],
  },
  {
    index: "03",
    area: "Segurança aplicada",
    title: "reconctx — evidência portátil para recon autorizado.",
    summary:
      "Ferramenta em desenvolvimento que transforma coletas limitadas em handoffs verificáveis para humanos e agentes.",
    context:
      "Recon produz muitas saídas, mas pouco contexto portátil. Sem proveniência e limites explícitos, agentes podem confundir histórico, observação atual e cobertura incompleta.",
    decision:
      "Uma CLI em Go com planejamento offline, aprovação humana por digest, execução limitada e compilação determinística. O agente recebe arquivos, nunca controle dos scanners.",
    evidence:
      "Versão pública para Linux amd64, contratos de CLI e escopo, threat model, fixture sanitizado, checksums e testes automatizados.",
    result:
      "A versão atual preserva artefatos, fatos normalizados, lacunas e referências verificáveis. O projeto segue em desenvolvimento, com suporte deliberadamente restrito.",
    id: "reconctx",
    href: "https://github.com/vtrpza/reconctx",
    linkLabel: "Inspecionar o reconctx",
    tags: ["Go", "AppSec", "Proveniência", "Recon autorizado"],
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <EditorialPage
      code="Índice / 01"
      eyebrow="Trabalho selecionado"
      title="Evidência antes de adjetivos."
      intro="Projetos públicos para inspecionar e experiência de produção apresentada sem inventar cliente, escala ou impacto."
      note="Projetos sob confidencialidade permanecem anonimizados. Métricas públicas entram somente quando há autorização e fonte verificável."
    >
      <section className="case-list" aria-label="Projetos selecionados">
        {cases.map((item) => (
          <article className="case-study" id={item.id} key={item.title}>
            <header className="case-heading">
              <span>{item.index} / {item.area}</span>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
            </header>

            <div className="case-grid">
              <section>
                <h3>Contexto</h3>
                <p>{item.context}</p>
              </section>
              <section>
                <h3>Decisão</h3>
                <p>{item.decision}</p>
              </section>
              <section>
                <h3>Evidência</h3>
                <p>{item.evidence}</p>
              </section>
              <section>
                <h3>Resultado</h3>
                <p>{item.result}</p>
              </section>
            </div>

            <footer className="case-footer">
              <ul className="tag-list" aria-label={`Tecnologias e temas de ${item.title}`}>
                {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <a className="case-link" href={item.href} target="_blank" rel="noreferrer">
                {item.linkLabel} <span aria-hidden="true">↗</span>
              </a>
            </footer>
          </article>
        ))}
      </section>

      <section className="evidence-band" id="trajectory" aria-labelledby="trajectory-title">
        <div>
          <p className="section-code">Trajetória / produção</p>
          <h2 id="trajectory-title">O que sustenta esses recortes.</h2>
        </div>
        <dl>
          <div><dt>08+</dt><dd>anos em engenharia full-stack</dd></div>
          <div><dt>04</dt><dd>MVPs em produção em 18 meses</dd></div>
          <div><dt>10k+</dt><dd>usuários diários em plataformas enterprise</dd></div>
          <div><dt>02</dt><dd>anos como consultor independente</dd></div>
        </dl>
        <p>
          Antes da consultoria independente, atuei na GFT Technologies e na act digital
          em sistemas financeiros, dashboards de BI e plataformas de grande uso.
        </p>
      </section>
    </EditorialPage>
  );
}
