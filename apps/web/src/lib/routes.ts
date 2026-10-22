type LoginParams = { reason?: "session_expired" | "signed_out"; next?: string };

function withQuery(path: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  ).toString();
  return query ? `${path}?${query}` : path;
}

/** Every in-app URL, so links and redirects cannot drift apart. */
export const routes = {
  home: () => "/",
  login: (params: LoginParams = {}) => withQuery("/login", params),
  dashboard: () => "/dashboard",
  projects: () => "/projects",
  project: (id: string) => `/projects/${id}`,
  findings: () => "/findings",
  finding: (id: string) => `/findings/${id}`,
  newFinding: () => "/findings/new",
  editFinding: (id: string) => `/findings/${id}/edit`,
};

/**
 * A `next` parameter is only honoured when it is a path on this site; anything
 * else (`//evil.example`, `/\evil.example`) would make login an open redirect.
 */
export function safeNextPath(next: string | null | undefined): string {
  const isLocalPath =
    !!next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\");
  return isLocalPath ? next : routes.dashboard();
}
