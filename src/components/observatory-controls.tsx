export type SystemLayer = "product" | "platform" | "security";

export const systemLayers: ReadonlyArray<{
  id: SystemLayer;
  index: string;
  label: string;
  detail: string;
  project: string;
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
    summary:
      "Ferramenta em desenvolvimento que transforma recon limitado em handoffs portáteis e verificáveis.",
    evidence:
      "Artefatos rastreáveis, fatos com proveniência, lacunas explícitas e checksums.",
    href: "/case-studies/#reconctx",
  },
];

type ObservatoryControlsProps = {
  active: SystemLayer;
  onSelect: (layer: SystemLayer) => void;
};

export function ObservatoryControls({
  active,
  onSelect,
}: ObservatoryControlsProps) {
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
