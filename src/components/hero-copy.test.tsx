import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroCopy } from "./hero-copy";

describe("HeroCopy", () => {
  it("abre com um ponto de vista de engenharia", () => {
    render(<HeroCopy />);

    expect(
      screen.getByRole("heading", {
        name: /construo produtos full-stack confiáveis, do problema à produção/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/uno produto, arquitetura e segurança/i)).toBeInTheDocument();
  });

  it("leva o visitante direto aos trabalhos", () => {
    render(<HeroCopy />);

    expect(screen.getByRole("link", { name: /ver 3 trabalhos/i })).toHaveAttribute(
      "href",
      "#trabalhos",
    );
  });
});
