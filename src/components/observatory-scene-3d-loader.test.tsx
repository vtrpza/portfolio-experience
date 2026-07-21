import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Scene3DLoader } from "./observatory-scene-3d-loader";

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }));
}

afterEach(() => {
  MockIntersectionObserver.instances = [];
  vi.unstubAllGlobals();
  delete (window as { matchMedia?: unknown }).matchMedia;
  delete (window as { IntersectionObserver?: unknown }).IntersectionObserver;
});

describe("Scene3DLoader", () => {
  it("não monta a cena 3D quando IntersectionObserver não existe", () => {
    const { container } = render(
      <div className="scene-art">
        <Scene3DLoader active="product" />
      </div>,
    );

    expect(container.querySelector(".scene-canvas-host")).toBeEmptyDOMElement();
    expect(container.querySelector(".scene-art")).not.toHaveAttribute("data-webgl");
  });

  it("não monta a cena 3D quando o usuário prefere movimento reduzido", () => {
    mockMatchMedia(true);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const { container } = render(
      <div className="scene-art">
        <Scene3DLoader active="product" />
      </div>,
    );

    MockIntersectionObserver.instances[0]?.trigger(true);

    expect(container.querySelector(".scene-canvas-host")).toBeEmptyDOMElement();
    expect(container.querySelector(".scene-art")).not.toHaveAttribute("data-webgl");
  });
});
