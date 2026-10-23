/**
 * The first segment of every query key, one per feature. Features never import
 * each other, but a Finding change must refresh the Dashboard and Project
 * counts too, so the roots they invalidate live here.
 */
export const QUERY_ROOTS = {
  dashboard: "dashboard",
  projects: "projects",
  findings: "findings",
} as const;
