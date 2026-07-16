"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ObservatoryControls,
  systemLayers,
  type SystemLayer,
} from "./observatory-controls";

const Scene = dynamic(
  () =>
    import("./observatory-canvas").then((module) => module.ObservatoryCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="scene-loading" role="status">
        <span />
        Calibrando mapa de sistemas
      </div>
    ),
  },
);

export function Observatory() {
  const [active, setActive] = useState<SystemLayer>("architecture");
  const activeLayer = systemLayers.find((layer) => layer.id === active) ?? systemLayers[0];

  return (
    <>
      <div className="scene-canvas" aria-hidden="true">
        <Scene active={active} />
      </div>

      <div className="scene-interface">
        <div className="scene-readout" aria-live="polite">
          <span>SYS.ATLAS / {activeLayer.index}</span>
          <strong>{activeLayer.label}</strong>
          <p>{activeLayer.detail}</p>
        </div>
        <ObservatoryControls active={active} onSelect={setActive} />
      </div>

      <div className="scene-fallback" aria-hidden="true">
        <span className="fallback-orbit fallback-orbit-one" />
        <span className="fallback-orbit fallback-orbit-two" />
        <span className="fallback-core">∴</span>
        <span className="fallback-node fallback-node-one" />
        <span className="fallback-node fallback-node-two" />
      </div>
    </>
  );
}
