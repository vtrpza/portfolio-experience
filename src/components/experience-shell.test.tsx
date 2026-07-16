import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceShell } from "./experience-shell";

describe("ExperienceShell", () => {
  it("trata a cena 3D como melhoria opcional", () => {
    render(<ExperienceShell scene={<div>cena carregada</div>} />);

    expect(
      screen.getByRole("region", { name: /um sistema, três camadas/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/cena carregada/i)).toBeInTheDocument();
    expect(screen.getByText(/escolha uma camada/i)).toBeInTheDocument();
  });

  it("mantém a jornada principal sem canvas", () => {
    render(<ExperienceShell scene={null} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver 3 trabalhos/i })).toBeInTheDocument();
    expect(screen.getByText(/MVPs em 18 meses/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ReplyFlow/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /conversar por e-mail/i })).toBeInTheDocument();
  });

  it("destaca o artigo aprovado mais recente quando disponível", () => {
    render(
      <ExperienceShell
        scene={null}
        latestArticle={{
          slug: "artigo-verificado",
          title: "Artigo verificado",
          excerpt: "Resumo sustentado por evidências.",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /artigo verificado/i })).toHaveAttribute(
      "href",
      "/artigos/artigo-verificado",
    );
  });
});
