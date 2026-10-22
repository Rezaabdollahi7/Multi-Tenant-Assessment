import createClient from "openapi-fetch";
import { routes } from "@/lib/routes";
import type { paths } from "./schema";
import { createSessionRenewal } from "./session-renewal";

/**
 * The browser's API client. Requests go to /api on this origin, which Next.js
 * proxies to the API (ADR 0002), so the session cookies travel automatically.
 */
export const api = createClient<paths>({
  baseUrl: globalThis.location?.origin ?? "",
  credentials: "same-origin",
});

api.use(
  createSessionRenewal({
    onSessionExpired() {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.assign(routes.login({ reason: "session_expired", next }));
    },
  }),
);
