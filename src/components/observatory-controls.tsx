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
    project: "ReplyFlow",
    summary:
      "CRM que reúne descoberta de vagas, pipeline, contatos e comunicação em um único fluxo.",
    evidence:
      "Seis fontes de vagas, autenticação, e-mail, pagamentos e monitoramento em uma aplicação.",
    href: "/case-studies/#replyflow",
  },
  {
    id: "platform",
    index: "02",
    label: "Plataforma",
    detail: "Dados & arquitetura",
    project: "Blog VR",
    summary:
      "Motor editorial rápido e auditável construído com Astro, TypeScript e MDX.",
    evidence:
      "Conteúdo, regras e integrações separados; testes e build antes de cada etapa concluída.",
    href: "/case-studies/#blog-vr",
  },
  {
    id: "security",
    index: "03",
    label: "Segurança",
    detail: "Risco & evidência",
    project: "GhostClaw",
    summary:
      "Laboratório público para pesquisa autorizada com escopo, estado e evidência.",
    evidence:
      "Validação por reprodução, estado rastreável e comunicação conservadora do impacto.",
    href: "/case-studies/#ghostclaw",
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
