import type { Middleware } from "openapi-fetch";

const AUTH_PATH = "/api/auth/";

export type SessionRenewalOptions = {
  /** Called once a refresh has failed; the session cannot be recovered. */
  onSessionExpired: () => void;
  fetch?: typeof fetch;
};

/**
 * On a 401, refreshes the session once and replays the request. Concurrent 401s
 * share one refresh, because the refresh token rotates and may only be used once.
 */
export function createSessionRenewal({
  onSessionExpired,
  fetch: fetchFn = (...args) => fetch(...args),
}: SessionRenewalOptions): Middleware {
  const pendingRequests = new Map<string, Request>();
  let refreshing: Promise<boolean> | null = null;

  const refreshOnce = (origin: string) => {
    refreshing ??= fetchFn(new URL(`${AUTH_PATH}refresh`, origin), {
      method: "POST",
      credentials: "same-origin",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
    return refreshing;
  };

  return {
    onRequest({ request, id }) {
      // Keep an unread copy: the original body is consumed by the first attempt.
      pendingRequests.set(id, request.clone());
    },

    async onResponse({ request, response, id }) {
      const replay = pendingRequests.get(id);
      pendingRequests.delete(id);

      const url = new URL(request.url);
      if (response.status !== 401 || url.pathname.startsWith(AUTH_PATH)) {
        return response;
      }

      if (replay && (await refreshOnce(url.origin))) {
        const retried = await fetchFn(replay);
        if (retried.status !== 401) return retried;
      }

      onSessionExpired();
      return response;
    },

    onError({ id }) {
      pendingRequests.delete(id);
    },
  };
}
