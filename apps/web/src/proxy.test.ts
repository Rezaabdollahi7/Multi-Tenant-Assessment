import { http, HttpResponse } from "msw";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { server } from "@/test/msw/server";
import { proxy } from "./proxy";

const APP = "http://localhost:3000";

function jwtExpiringIn(seconds: number): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }),
  ).toString("base64url");
  return `header.${payload}.signature`;
}

function requestTo(path: string, cookies: Record<string, string> = {}) {
  const cookie = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
  return new NextRequest(new URL(path, APP), { headers: { cookie } });
}

describe("proxy", () => {
  it("lets a fresh session through", async () => {
    const response = await proxy(
      requestTo("/findings", { "X-ACCESS": jwtExpiringIn(600) }),
    );
    expect(response.headers.get("location")).toBeNull();
  });

  it("sends a visitor without a session to sign-in, keeping the destination", async () => {
    const response = await proxy(requestTo("/findings?severity=HIGH"));
    expect(response.headers.get("location")).toBe(
      `${APP}/login?next=%2Ffindings%3Fseverity%3DHIGH`,
    );
  });

  it("renews an expiring session and forwards the rotated cookies", async () => {
    server.use(
      http.post("http://localhost:3001/api/auth/refresh", () =>
        HttpResponse.json(
          { success: true },
          {
            headers: [
              ["Set-Cookie", "X-ACCESS=renewed-access; Path=/; HttpOnly"],
              ["Set-Cookie", "X-REFRESH=renewed-refresh; Path=/; HttpOnly"],
            ],
          },
        ),
      ),
    );

    const response = await proxy(
      requestTo("/dashboard", {
        "X-ACCESS": jwtExpiringIn(10),
        "X-REFRESH": "old-refresh",
      }),
    );

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.getSetCookie()).toEqual([
      "X-ACCESS=renewed-access; Path=/; HttpOnly",
      "X-REFRESH=renewed-refresh; Path=/; HttpOnly",
    ]);
  });

  it("signs out a session the API refuses to renew", async () => {
    server.use(
      http.post("http://localhost:3001/api/auth/refresh", () =>
        HttpResponse.json({ statusCode: 401 }, { status: 401 }),
      ),
    );

    const response = await proxy(
      requestTo("/projects", { "X-REFRESH": "revoked" }),
    );

    expect(response.headers.get("location")).toBe(
      `${APP}/login?next=%2Fprojects&reason=session_expired`,
    );
    expect(response.headers.getSetCookie().join()).toMatch(/X-REFRESH=;/);
  });

  it("never guards the sign-in page itself", async () => {
    const response = await proxy(requestTo("/login"));
    expect(response.headers.get("location")).toBeNull();
  });
});
