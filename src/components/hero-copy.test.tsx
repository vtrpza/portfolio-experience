import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroCopy } from "./hero-copy";

describe("HeroCopy", () => {
  it("abre com um ponto de vista de engenharia", () => {
    render(<HeroCopy />);

    expect(
      screen.getByRole("heading", {
        name: /transformo problemas complexos em produtos confiáveis/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/primeiro commit ao deploy/i)).toBeInTheDocument();
  });

  it("leva o visitante direto aos trabalhos", () => {
    render(<HeroCopy />);

    expect(screen.getByRole("link", { name: /ver trabalhos/i })).toHaveAttribute(
      "href",
      "/case-studies",
    );
  });
});
