import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceShell } from "./experience-shell";

describe("ExperienceShell", () => {
  it("abre com evidência de produção e conversão direta", () => {
    render(<ExperienceShell />);

    expect(
      screen.getByRole("heading", {
        name: "Transformo problemas complexos em produtos confiáveis — da decisão à produção.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("8+")).toBeInTheDocument();
    expect(screen.getByText(/MVPs entregues em 18 meses/i)).toBeInTheDocument();
    expect(screen.getByText("10k+")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /conte o contexto/i })).toHaveAttribute(
      "href",
      "mailto:vhnpouza@gmail.com",
    );
  });

  it("mostra cada projeto uma vez com problema, decisão, prova e evidência", () => {
    const { container } = render(<ExperienceShell />);
    const projects = [
      ["reconctx", "https://github.com/vtrpza/reconctx"],
      ["Blog VR", "https://github.com/vtrpza/blog-vr"],
      ["Repo Pulse", "https://github.com/vtrpza/repo-pulse"],
    ] as const;

    expect(container.querySelectorAll("#trabalhos .case-entry")).toHaveLength(3);
    projects.forEach(([project, href]) => {
      const headings = screen.getAllByRole("heading", { name: project });
      expect(headings).toHaveLength(1);
      const article = headings[0].closest("article");
      expect(article).not.toBeNull();
      expect(within(article!).getByText("Problema")).toBeInTheDocument();
      expect(within(article!).getByText("Decisão")).toBeInTheDocument();
      expect(within(article!).getByText("Prova")).toBeInTheDocument();
      expect(
        within(article!).getByRole("link", { name: `Ver evidência de ${project}` }),
      ).toHaveAttribute("href", href);
    });

    expect(screen.getByRole("heading", { level: 3, name: "O problema real" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "O sistema completo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Confiança para operar" })).toBeInTheDocument();
  });

  it("renderiza o artigo mais recente apenas quando disponível", () => {
    const { rerender } = render(<ExperienceShell />);

    expect(screen.queryByText("Artigo recente")).not.toBeInTheDocument();

    rerender(
      <ExperienceShell
        latestArticle={{
          slug: "artigo-verificado",
          title: "Artigo verificado",
          excerpt: "Resumo sustentado por evidências.",
        }}
      />,
    );

    expect(screen.getByText("Artigo recente")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /artigo verificado/i })).toHaveAttribute(
      "href",
      "/artigos/artigo-verificado",
    );
  });
});
