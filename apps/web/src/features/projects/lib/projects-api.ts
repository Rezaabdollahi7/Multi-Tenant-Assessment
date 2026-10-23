import "server-only";
import { cache } from "react";
import { ApiError, unwrap } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";
import type { ProjectListParams } from "./schemas";

const PROJECTS_PAGE_SIZE = 10;
const NOT_FOUND_STATUSES = new Set([400, 404]);

export async function listProjects(params: ProjectListParams) {
  return unwrap(
    (await serverApi()).GET("/api/projects", {
      params: { query: { ...params, limit: PROJECTS_PAGE_SIZE } },
    }),
  );
}

export const getProject = cache(async (id: string) => {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/projects/{id}", {
    params: { path: { id } },
  });
  if (NOT_FOUND_STATUSES.has(response.status)) return null;
  if (!data) throw new ApiError(response.status, error);
  return data;
});

export async function getProjectMembers(id: string) {
  return unwrap(
    (await serverApi()).GET("/api/projects/{id}/members", {
      params: { path: { id } },
    }),
  );
}
