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
    id: "security",
    index: "01",
    label: "Segurança",
    detail: "Recon & proveniência",
    project: "reconctx",
    problem:
      "Saídas de recon chegavam sem contexto portátil, proveniência e limites claros.",
    summary:
      "Compilador de contexto que transforma recon controlado em um handoff portátil e verificável.",
    evidence:
      "Artefatos rastreáveis, proveniência por evidência, checksums e lacunas explícitas — sem execução autônoma.",
    href: "https://github.com/vtrpza/reconctx",
  },
  {
    id: "platform",
    index: "02",
    label: "Plataforma",
    detail: "Conteúdo & automação",
    project: "Blog VR",
    problem:
      "A aquisição orgânica dependia de uma operação editorial sem controle técnico suficiente.",
    summary:
      "Plataforma editorial SSR para conteúdo jurídico, captação e publicação controlada.",
    evidence:
      "Cloudflare Workers, D1, Workflows, OpenAI, Turnstile e Pipedrive em um fluxo auditável.",
    href: "https://github.com/vtrpza/blog-vr",
  },
  {
    id: "product",
    index: "03",
    label: "Produto",
    detail: "Busca & decisão",
    project: "Repo Pulse",
    problem:
      "Encontrar e comparar repositórios relevantes exigia abrir muitos projetos e reconstruir o contexto manualmente.",
    summary:
      "Radar para encontrar e comparar repositórios públicos adequados a uma necessidade concreta.",
    evidence:
      "Busca GitHub, filtros, score comparativo e histórico de snapshots persistido no D1.",
    href: "https://github.com/vtrpza/repo-pulse",
  },
];

type ObservatoryControlsProps = {
  active: SystemLayer;
  onSelect: (layer: SystemLayer) => void;
};

export function ObservatoryControls({ active, onSelect }: ObservatoryControlsProps) {
  return (
    <div className="observatory-controls" role="group" aria-label="Inspecionar camadas do sistema">
      {systemLayers.map((layer) => (
        <button
          key={layer.id}
          type="button"
          aria-pressed={active === layer.id}
          onClick={() => onSelect(layer.id)}
        >
          <span className="control-index">{layer.index}</span>
          <span className="control-copy">
            <strong>{layer.label}</strong>
            <small>{layer.detail}</small>
          </span>
          <span className="control-signal" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
