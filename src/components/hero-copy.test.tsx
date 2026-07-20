import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroCopy } from "./hero-copy";

describe("HeroCopy", () => {
  it("abre com a proposta de valor aprovada", () => {
    render(<HeroCopy />);

    expect(
      screen.getByRole("heading", {
        name: "Transformo problemas complexos em produtos confiáveis — da decisão à produção.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/fundadores e líderes de produto/i)).toBeInTheDocument();
  });

  it("oferece conversa direta e acesso aos trabalhos", () => {
    render(<HeroCopy />);

    expect(screen.getByRole("link", { name: /conversar sobre o projeto/i })).toHaveAttribute(
      "href",
      "mailto:vhnpouza@gmail.com?subject=Novo%20projeto%20via%20vitorpouza.dev",
    );
    expect(screen.getByRole("link", { name: /ver trabalhos/i })).toHaveAttribute(
      "href",
      "#trabalhos",
    );
  });
});
