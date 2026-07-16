import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ObservatoryControls } from "./observatory-controls";

describe("ObservatoryControls", () => {
  it("expõe três camadas com estado selecionado", () => {
    render(<ObservatoryControls active="architecture" onSelect={() => undefined} />);

    expect(screen.getByRole("button", { name: /produto/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /plataforma/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: /segurança/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("informa a camada selecionada", () => {
    const onSelect = vi.fn();
    render(<ObservatoryControls active="architecture" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /plataforma/i }));

    expect(onSelect).toHaveBeenCalledWith("product");
  });
});
