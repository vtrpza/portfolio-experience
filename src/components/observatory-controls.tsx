export type SystemLayer = "architecture" | "product" | "platform";

export const systemLayers: ReadonlyArray<{
  id: SystemLayer;
  index: string;
  label: string;
  detail: string;
}> = [
  {
    id: "architecture",
    index: "01",
    label: "Produto",
    detail: "Problema & experiência",
  },
  {
    id: "product",
    index: "02",
    label: "Plataforma",
    detail: "Dados & arquitetura",
  },
  {
    id: "platform",
    index: "03",
    label: "Segurança",
    detail: "Risco & evidência",
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
