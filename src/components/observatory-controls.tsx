export type SystemLayer = "product" | "platform" | "security";

export const systemLayers: ReadonlyArray<{
  id: SystemLayer;
  index: string;
  label: string;
  detail: string;
  project: string;
  problem: string;
  summary: string;
  evidence: string;
  href: string;
}> = [
  {
    id: "product",
    index: "01",
    label: "Produto",
    detail: "Problema & experiência",
    project: "Repo Pulse",
    problem:
      "Encontrar e comparar repositórios relevantes exigia abrir muitos projetos e reconstruir o contexto manualmente.",
    summary:
      "Radar que encontra e compara repositórios GitHub para uma necessidade concreta.",
    evidence:
      "Filtros rastreáveis, sinal comparativo, perfis de ranking e snapshots persistidos no D1.",
    href: "/case-studies/#repo-pulse",
  },
  {
    id: "platform",
    index: "02",
    label: "Plataforma",
    detail: "Dados & arquitetura",
    project: "Blog VR",
    problem:
      "A aquisição orgânica dependia de uma operação editorial sem controle técnico suficiente.",
    summary:
      "Plataforma editorial em produção em um Worker SSR, com fontes verificáveis e automação governada.",
    evidence:
      "D1, Workflows, quality gates e formulário protegido por Turnstile com integração ao Pipedrive.",
    href: "/case-studies/#blog-vr",
  },
  {
    id: "security",
    index: "03",
    label: "Segurança",
    detail: "Risco & evidência",
    project: "reconctx",
    problem:
      "Saídas de recon chegavam sem contexto portátil, proveniência e limites claros.",
    summary:
      "Ferramenta em desenvolvimento que transforma recon limitado em handoffs portáteis e verificáveis.",
    evidence:
      "Artefatos rastreáveis, fatos com proveniência, lacunas explícitas e checksums.",
    href: "/case-studies/#reconctx",
  },
];
