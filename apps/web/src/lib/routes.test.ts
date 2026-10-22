import { describe, expect, it } from "vitest";
import { routes, safeNextPath } from "./routes";

describe("routes.login", () => {
  it("encodes the reason and return path", () => {
    expect(
      routes.login({ reason: "session_expired", next: "/findings?page=2" }),
    ).toBe("/login?reason=session_expired&next=%2Ffindings%3Fpage%3D2");
  });

  it("omits an empty query string", () => {
    expect(routes.login()).toBe("/login");
  });
});

describe("safeNextPath", () => {
  it("keeps a path on this site", () => {
    expect(safeNextPath("/projects/42?tab=members")).toBe(
      "/projects/42?tab=members",
    );
  });

  it.each([
    ["missing", null],
    ["an absolute URL", "https://evil.example"],
    ["a protocol-relative URL", "//evil.example"],
    ["a backslash trick", "/\\evil.example"],
  ])("falls back to the dashboard for %s", (_, next) => {
    expect(safeNextPath(next)).toBe("/dashboard");
  });
});
