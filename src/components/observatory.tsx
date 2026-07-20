"use client";

import { useState } from "react";
import {
  ObservatoryControls,
  systemLayers,
  type SystemLayer,
} from "./observatory-controls";

export function Observatory() {
  const [active, setActive] = useState<SystemLayer>("security");
  const activeLayer = systemLayers.find((layer) => layer.id === active) ?? systemLayers[0];

  return (
    <>
      <div className="scene-art" aria-hidden="true">
        <div className="system-stack" data-active={active}>
          {systemLayers.map((layer) => (
            <span className="system-plane" data-layer={layer.id} key={layer.id}>
              <i /><i /><i />
            </span>
          ))}
        </div>
      </div>

      <div className="scene-interface">
        <div className="scene-readout" aria-live="polite" aria-atomic="true">
          <span>{activeLayer.index} / {activeLayer.label}</span>
          <strong>{activeLayer.project}</strong>
          <p>{activeLayer.summary}</p>
          <small><b>Prova:</b> {activeLayer.evidence}</small>
          <a href={activeLayer.href} target="_blank" rel="noreferrer">
            Abrir repositório <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ObservatoryControls active={active} onSelect={setActive} />
      </div>

    </>
  );
}
