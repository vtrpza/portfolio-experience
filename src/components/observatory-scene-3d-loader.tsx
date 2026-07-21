"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { SystemLayer } from "./observatory-controls";

const ObservatoryScene3D = dynamic(() => import("./observatory-scene-3d"), { ssr: false });

class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Scene3DLoaderProps = {
  active: SystemLayer;
};

export function Scene3DLoader({ active }: Scene3DLoaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneArtRef = useRef<Element | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || prefersReducedMotion() || typeof IntersectionObserver !== "function") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setShouldMount(true);
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const handleCreated = useCallback(() => {
    const sceneArt = hostRef.current?.closest(".scene-art") ?? null;
    sceneArtRef.current = sceneArt;
    sceneArt?.setAttribute("data-webgl", "on");
  }, []);

  useEffect(() => () => sceneArtRef.current?.removeAttribute("data-webgl"), []);

  return (
    <div className="scene-canvas-host" ref={hostRef}>
      {shouldMount ? (
        <SceneErrorBoundary>
          <ObservatoryScene3D active={active} onCreated={handleCreated} visible={visible} />
        </SceneErrorBoundary>
      ) : null}
    </div>
  );
}
