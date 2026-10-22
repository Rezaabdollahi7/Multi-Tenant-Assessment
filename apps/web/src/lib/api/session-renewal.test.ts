import createClient from "openapi-fetch";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { apiUrl, server, TEST_ORIGIN } from "@/test/msw/server";
import { ApiError, unwrap } from "./api-error";
import type { paths } from "./schema";
import { createSessionRenewal } from "./session-renewal";

function createTestClient() {
  const onSessionExpired = vi.fn();
  const client = createClient<paths>({ baseUrl: TEST_ORIGIN });
  client.use(createSessionRenewal({ onSessionExpired }));
  return { client, onSessionExpired };
}

const summary = {
  projectsCount: 1,
  findingsCount: 0,
  severityBreakdown: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 },
  projectStatusBreakdown: {
    PLANNED: 1,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    ARCHIVED: 0,
  },
};

/** The summary endpoint answers 401 until a refresh succeeds. */
function expiringSession({ refreshSucceeds }: { refreshSucceeds: boolean }) {
  let refreshed = false;
  const refreshCalls = vi.fn();
  server.use(
    http.post(apiUrl("/auth/refresh"), () => {
      refreshCalls();
      refreshed = refreshSucceeds;
      return refreshSucceeds
        ? HttpResponse.json({ success: true })
        : HttpResponse.json({ statusCode: 401 }, { status: 401 });
    }),
    http.get(apiUrl("/dashboard/summary"), () =>
      refreshed
        ? HttpResponse.json(summary)
        : HttpResponse.json({ statusCode: 401 }, { status: 401 }),
    ),
  );
  return { refreshCalls };
}

describe("session renewal", () => {
  it("refreshes an expired session and replays the request", async () => {
    const { refreshCalls } = expiringSession({ refreshSucceeds: true });
    const { client, onSessionExpired } = createTestClient();

    await expect(unwrap(client.GET("/api/dashboard/summary"))).resolves.toEqual(
      summary,
    );
    expect(refreshCalls).toHaveBeenCalledOnce();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("shares one refresh between concurrent requests", async () => {
    const { refreshCalls } = expiringSession({ refreshSucceeds: true });
    const { client } = createTestClient();

    await Promise.all([
      unwrap(client.GET("/api/dashboard/summary")),
      unwrap(client.GET("/api/dashboard/summary")),
      unwrap(client.GET("/api/dashboard/summary")),
    ]);
    expect(refreshCalls).toHaveBeenCalledOnce();
  });

  it("reports an expired session when the refresh is rejected", async () => {
    expiringSession({ refreshSucceeds: false });
    const { client, onSessionExpired } = createTestClient();

    await expect(
      unwrap(client.GET("/api/dashboard/summary")),
    ).rejects.toMatchObject({ status: 401 });
    expect(onSessionExpired).toHaveBeenCalledOnce();
  });

  it("does not try to refresh after a failed sign-in", async () => {
    server.use(
      http.post(apiUrl("/auth/verify-otp"), () =>
        HttpResponse.json(
          { statusCode: 401, message: "Invalid code." },
          { status: 401 },
        ),
      ),
    );
    const { client, onSessionExpired } = createTestClient();

    await expect(
      unwrap(
        client.POST("/api/auth/verify-otp", {
          body: { phone: "09911110001", code: "11111" },
        }),
      ),
    ).rejects.toThrow("Invalid code.");
    expect(onSessionExpired).not.toHaveBeenCalled();
  });
});

describe("unwrap", () => {
  it("exposes field-level validation errors", async () => {
    server.use(
      http.post(apiUrl("/findings"), () =>
        HttpResponse.json(
          {
            statusCode: 400,
            message: "Validation failed",
            errors: { title: ["title must be at least 3 characters"] },
          },
          { status: 400 },
        ),
      ),
    );
    const { client } = createTestClient();

    const error = await unwrap(
      client.POST("/api/findings", {
        body: { title: "ab", severity: "LOW", projectId: crypto.randomUUID() },
      }),
    ).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).fieldErrors).toEqual({
      title: ["title must be at least 3 characters"],
    });
  });
});
