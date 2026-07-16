import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteNav } from "./site-nav";

describe("SiteNav", () => {
  it("expõe todas as rotas principais do portfólio", () => {
    render(<SiteNav />);

    expect(screen.getByRole("link", { name: /trabalhos/i })).toHaveAttribute(
      "href",
      "/case-studies",
    );
    expect(screen.getByRole("link", { name: /laboratório/i })).toHaveAttribute(
      "href",
      "/playground",
    );
    expect(screen.getByRole("link", { name: /^artigos$/i })).toHaveAttribute(
      "href",
      "/artigos",
    );
    expect(screen.getByRole("link", { name: /^sobre$/i })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: /ferramentas/i })).toHaveAttribute(
      "href",
      "/uses",
    );
  });

  it("tem um link acessível para o início", () => {
    const { container } = render(<SiteNav />);

    expect(screen.getByRole("link", { name: /início/i })).toHaveAttribute("href", "/");
    expect(container.querySelector(".brand-logo")).toBeInTheDocument();
  });
});
