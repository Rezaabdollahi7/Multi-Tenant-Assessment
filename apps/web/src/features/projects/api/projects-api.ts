import { unwrap } from "@/lib/api/api-error";
import { api } from "@/lib/api/client";
import type { ProjectListParams } from "../schemas";

export const PROJECTS_PAGE_SIZE = 10;

export const projectKeys = {
  all: ["projects"] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, "list", params] as const,
};

export function listProjects(params: ProjectListParams) {
  return unwrap(
    api.GET("/api/projects", {
      params: { query: { ...params, limit: PROJECTS_PAGE_SIZE } },
    }),
  );
}
