import { describe, expect, it } from "vitest";
import { isAccessTokenFresh } from "./session-cookies";

const NOW = Date.UTC(2026, 9, 22, 12, 0, 0);

function tokenExpiringIn(seconds: number): string {
  const payload = btoa(JSON.stringify({ exp: NOW / 1000 + seconds }))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `header.${payload}.signature`;
}

describe("isAccessTokenFresh", () => {
  it("accepts a token with time left", () => {
    expect(isAccessTokenFresh(tokenExpiringIn(600), NOW)).toBe(true);
  });

  it("treats a token within 30 seconds of expiry as stale", () => {
    expect(isAccessTokenFresh(tokenExpiringIn(20), NOW)).toBe(false);
  });

  it.each([
    ["missing", undefined],
    ["not a JWT", "garbage"],
    ["an unreadable payload", "a.%%%.c"],
  ])("rejects a %s token", (_, token) => {
    expect(isAccessTokenFresh(token, NOW)).toBe(false);
  });
});
