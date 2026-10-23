import createClient from "openapi-fetch";
import { routes } from "@/lib/routes";
import type { paths } from "@/assets/types/api-schema";
import { createSessionRenewal } from "./session-renewal";

export const api = createClient<paths>({
  baseUrl: globalThis.location?.origin ?? "",
  credentials: "same-origin",
  fetch: (request) => globalThis.fetch(request),
});

api.use(
  createSessionRenewal({
    onSessionExpired() {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.assign(routes.login({ reason: "session_expired", next }));
    },
  }),
);
