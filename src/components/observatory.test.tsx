import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Observatory } from "./observatory";

describe("Observatory", () => {
  it("liga a seleção visual à evidência correspondente", () => {
    const { container } = render(<Observatory />);

    expect(container.querySelector(".system-stack")).toHaveAttribute("data-active", "security");
    fireEvent.click(screen.getByRole("button", { name: /produto/i }));

    expect(container.querySelector(".system-stack")).toHaveAttribute("data-active", "product");
    expect(screen.getByRole("link", { name: /abrir repositório/i })).toHaveAttribute(
      "href",
      "https://github.com/vtrpza/repo-pulse",
    );
  });
});
