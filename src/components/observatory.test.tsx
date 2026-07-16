import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Observatory } from "./observatory";

describe("Observatory", () => {
  it("liga a seleção visual à evidência correspondente", () => {
    const { container } = render(<Observatory />);

    expect(container.querySelector(".system-stack")).toHaveAttribute("data-active", "product");
    fireEvent.click(screen.getByRole("button", { name: /segurança/i }));

    expect(container.querySelector(".system-stack")).toHaveAttribute("data-active", "security");
    expect(screen.getByRole("link", { name: /ver evidência/i })).toHaveAttribute(
      "href",
      "/case-studies#ghostclaw",
    );
  });
});
