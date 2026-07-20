import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteNav } from "./site-nav";

describe("SiteNav", () => {
  it("expõe todas as rotas no desktop e no menu móvel", () => {
    const { container } = render(<SiteNav />);
    const desktop = screen.getByRole("navigation", { name: /navegação principal/i });
    const mobile = container.querySelector<HTMLElement>("nav[aria-label='Navegação móvel']");
    const routes = [
      ["Trabalhos", "/case-studies"],
      ["Laboratório", "/playground"],
      ["Artigos", "/artigos"],
      ["Sobre", "/about"],
      ["Ferramentas", "/uses"],
    ] as const;

    expect(mobile).not.toBeNull();
    routes.forEach(([label, href]) => {
      expect(within(desktop).getByRole("link", { name: label })).toHaveAttribute("href", href);
      expect(within(mobile!).getByText(label).closest("a")).toHaveAttribute("href", href);
    });
  });

  it("oferece skip link, início e disponibilidade", () => {
    const { container } = render(<SiteNav />);

    expect(screen.getByRole("link", { name: /pular para o conteúdo/i })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByRole("link", { name: /início/i })).toHaveAttribute("href", "/");
    expect(container.querySelector(".brand-logo")).toBeInTheDocument();
    expect(container.querySelectorAll("a[href='mailto:vhnpouza@gmail.com']")).toHaveLength(2);
  });

  it("usa um details nativo para o menu móvel", () => {
    const { container } = render(<SiteNav />);
    const details = container.querySelector("details.mobile-menu");
    const summary = container.querySelector("details.mobile-menu > summary");

    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveTextContent("Menu");
    fireEvent.click(summary!);
    expect(details).toHaveAttribute("open");
  });
});
