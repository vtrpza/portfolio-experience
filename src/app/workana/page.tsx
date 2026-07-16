import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfólio profissional — Vitor Pouza",
  description: "Versão de apresentação preparada para propostas na Workana.",
  robots: { index: false, follow: false },
};

const services = [
  {
    number: "01",
    title: "Produtos web e MVPs",
    copy: "Da definição do recorte à publicação: interface, regras de negócio, dados, integrações, testes e deploy.",
  },
  {
    number: "02",
    title: "Integrações e automação",
    copy: "APIs, pagamentos, inteligência artificial e fluxos operacionais conectados com tratamento de falha e documentação.",
  },
  {
    number: "03",
    title: "Auditoria técnica e segurança",
    copy: "Revisão de arquitetura, código e comportamento real para encontrar risco, validar impacto e orientar a correção.",
  },
] as const;

const work = [
  {
    title: "ReplyFlow",
    type: "Produto full-stack",
    copy: "CRM de busca de trabalho que reúne descoberta de vagas, pipeline, contexto de recrutadores e comunicação em um fluxo único.",
    proof: "Seis fontes de vagas, autenticação, e-mail, pagamentos e monitoramento em uma aplicação.",
  },
  {
    title: "Blog VR",
    type: "Conteúdo e aquisição",
    copy: "Motor editorial rápido e auditável para transformar conteúdo jurídico em aquisição orgânica, sem publicação automática por IA.",
    proof: "Conteúdo, regras e integrações separados; testes e build antes de cada etapa concluída.",
  },
  {
    title: "Pesquisa de segurança",
    type: "Segurança aplicada",
    copy: "Fluxo autorizado para organizar escopo, hipóteses, testes, evidência e relatório sem confundir resultado de ferramenta com vulnerabilidade.",
    proof: "Validação por reprodução, estado rastreável e comunicação conservadora do impacto.",
  },
] as const;

export default function WorkanaPortfolioPage() {
  return (
    <main className="workana-sheet">
      <header className="workana-hero">
        <div className="workana-kicker">
          <span className="brand-mark" aria-hidden="true">∴</span>
          <span>PORTFÓLIO PROFISSIONAL / 2026</span>
        </div>
        <p className="workana-role">Engenheiro Full-Stack Sênior</p>
        <h1>Vitor Pouza</h1>
        <p className="workana-lead">
          Transformo problemas de negócio em produtos digitais prontos para uso — do
          primeiro alinhamento ao deploy, sem empurrar complexidade desnecessária para o cliente.
        </p>
        <dl className="workana-stats">
          <div><dt>08+</dt><dd>anos de experiência</dd></div>
          <div><dt>04</dt><dd>MVPs em 18 meses</dd></div>
          <div><dt>02</dt><dd>anos como consultor</dd></div>
          <div><dt>10k+</dt><dd>usuários em sistemas enterprise</dd></div>
        </dl>
      </header>

      <section className="workana-section" aria-labelledby="services-title">
        <p className="workana-section-code">O que eu entrego</p>
        <h2 id="services-title">Um responsável pelo produto inteiro.</h2>
        <div className="workana-services">
          {services.map((service) => (
            <article key={service.number}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workana-section" aria-labelledby="work-title">
        <p className="workana-section-code">Trabalho selecionado</p>
        <h2 id="work-title">Três recortes do mesmo método.</h2>
        <div className="workana-projects">
          {work.map((item, index) => (
            <article key={item.title}>
              <div className="workana-project-index">0{index + 1}</div>
              <div>
                <p>{item.type}</p>
                <h3>{item.title}</h3>
                <span>{item.copy}</span>
              </div>
              <p className="workana-proof"><strong>Prova:</strong> {item.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workana-section workana-process" aria-labelledby="process-title">
        <div>
          <p className="workana-section-code">Como funciona</p>
          <h2 id="process-title">Clareza antes de código.</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Entendimento</strong><p>Objetivo, público, riscos e critério de sucesso.</p></li>
          <li><span>02</span><strong>Primeira entrega</strong><p>O menor fluxo completo que já pode ser validado.</p></li>
          <li><span>03</span><strong>Validação</strong><p>Testes, revisão e ajustes no que realmente muda o resultado.</p></li>
          <li><span>04</span><strong>Produção</strong><p>Deploy, documentação e passagem de bastão.</p></li>
        </ol>
      </section>

      <footer className="workana-footer">
        <div>
          <strong>Vitor Pouza</strong>
          <span>Full-stack · Produto · Segurança aplicada</span>
        </div>
        <p>Contato e contratação exclusivamente pela Workana.</p>
      </footer>
    </main>
  );
}
