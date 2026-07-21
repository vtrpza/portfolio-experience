import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import worker from "./index";

describe("verification worker", () => {
  it("serves the Google verification file without a redirect", async () => {
    const response = worker.fetch();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/html; charset=UTF-8");
    expect(await response.text()).toBe(
      readFileSync(join(process.cwd(), "public/google0752999b923df8aa.html"), "utf8"),
    );
  });
});
