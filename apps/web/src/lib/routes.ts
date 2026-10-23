import type { SignInReason } from "@/assets/types/auth";

type LoginParams = { reason?: SignInReason; next?: string };
type FindingsParams = { projectId?: string };
type NewFindingParams = { projectId?: string };

function withQuery(path: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  ).toString();
  return query ? `${path}?${query}` : path;
}

export const routes = {
  home: () => "/",
  login: (params: LoginParams = {}) => withQuery("/login", params),
  dashboard: () => "/dashboard",
  projects: () => "/projects",
  project: (id: string) => `/projects/${id}`,
  findings: (params: FindingsParams = {}) => withQuery("/findings", params),
  finding: (id: string) => `/findings/${id}`,
  newFinding: (params: NewFindingParams = {}) =>
    withQuery("/findings/new", params),
  editFinding: (id: string) => `/findings/${id}/edit`,
};

export function safeNextPath(next: string | null | undefined): string {
  const isLocalPath =
    !!next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\");
  return isLocalPath ? next : routes.dashboard();
}
