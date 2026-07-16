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
    title: "ReplyFlow — busca de trabalho tratada como operação.",
    summary:
      "CRM para desenvolvedores que reúne descoberta de vagas, pipeline ATS, contexto de recrutadores e outreach em um fluxo único.",
    context:
      "O processo estava espalhado entre links, planilhas, e-mail e memória. O produto precisava reduzir dispersão sem virar mais um job board.",
    decision:
      "Uma aplicação full-stack com seis conectores de vagas, pipeline, contatos e e-mail no mesmo modelo operacional. O recorte inicial prioriza direção e consistência.",
    evidence:
      "Next.js 16, React 19, TypeScript, SQLite/Drizzle, NextAuth, Gmail API, Sentry, PostHog e deploy na Fly.io. Repositório público e versão release candidate.",
    result:
      "Os fluxos centrais estão estáveis: sourcing, acompanhamento ATS, contatos, outreach, billing e instrumentação. O repositório recebeu 5 estrelas no GitHub.",
    href: "https://github.com/vtrpza/replyflow",
    linkLabel: "Inspecionar o ReplyFlow",
    tags: ["Produto", "Next.js", "Integrações", "Observabilidade"],
  },
  {
    index: "02",
    area: "Aquisição orgânica",
    title: "Blog VR — conteúdo como sistema de aquisição.",
    summary:
      "Motor editorial para transformar conteúdo jurídico em aquisição orgânica, com publicação controlada e arquitetura preparada para integrações comerciais.",
    context:
      "O desafio não era apenas publicar artigos. Era criar uma base rápida, auditável e segura para conteúdo sensível, geração de leads e evolução contínua.",
    decision:
      "Astro, TypeScript e MDX para reduzir JavaScript no cliente; implementação por slices verticais; regras reutilizáveis em TDD; nenhuma publicação automática por IA.",
    evidence:
      "Pipeline local de teste, check e build; arquitetura preparada para Cloudflare Pages/Workers/D1, Turnstile, Pipedrive e rastreamento.",
    result:
      "A entrega separa conteúdo, regras e integrações, preserva revisão humana e deixa o crescimento do canal independente de um CMS pesado.",
    href: "https://github.com/vtrpza/blog-vr",
    linkLabel: "Inspecionar o Blog VR",
    tags: ["Astro", "TypeScript", "SEO", "Cloudflare"],
  },
  {
    index: "03",
    area: "Segurança aplicada",
    title: "GhostClaw — pesquisa autorizada com estado e evidência.",
    summary:
      "Laboratório público para organizar recon, hipóteses, testes, validação e relatório em programas de bug bounty autorizados.",
    context:
      "Pesquisa de segurança gera muito ruído. Sem escopo, rastreabilidade e critérios de validação, automação apenas produz mais resultados difíceis de confiar.",
    decision:
      "Fluxo em seis fases, escopo explícito por alvo, estado em JSON e ferramentas pequenas para HTTP, browser, DNS e callbacks fora de banda.",
    evidence:
      "Projeto Python público sob licença MIT, documentação de arquitetura, limites de corpo, rate limiting e proteções para caminhos e seletores.",
    result:
      "A metodologia torna hipótese, execução e evidência inspecionáveis. Achados só avançam depois de reprodução e avaliação de impacto.",
    href: "https://github.com/vtrpza/ghost-claw",
    linkLabel: "Inspecionar o GhostClaw",
    tags: ["Python", "AppSec", "Evidência", "Bug bounty autorizado"],
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
          <article className="case-study" key={item.title}>
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

      <section className="evidence-band" aria-labelledby="trajectory-title">
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
