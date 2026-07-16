import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceShell } from "./experience-shell";

describe("ExperienceShell", () => {
  it("trata a cena 3D como melhoria opcional", () => {
    render(<ExperienceShell scene={<div>cena carregada</div>} />);

    expect(
      screen.getByRole("region", { name: /observatório de sistemas/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/cena carregada/i)).toBeInTheDocument();
    expect(screen.getByText(/arraste para orbitar/i)).toBeInTheDocument();
  });

  it("mantém a jornada principal sem canvas", () => {
    render(<ExperienceShell scene={null} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver trabalhos/i })).toBeInTheDocument();
    expect(screen.getByText(/4 MVPs em 18 meses/i)).toBeInTheDocument();
  });
});
