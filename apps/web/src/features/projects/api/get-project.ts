import "server-only";
import { cache } from "react";
import { ApiError } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";

/**
 * Statuses that mean "no such Project here": another Organization's Project
 * is a 404, and a malformed id is rejected with a 400.
 */
const NOT_FOUND_STATUSES = new Set([400, 404]);

/** The Project, or null when this Organization has none with that id. Cached per request. */
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
  const api = await serverApi();
  const { data, error, response } = await api.GET(
    "/api/projects/{id}/members",
    {
      params: { path: { id } },
    },
  );
  if (!data) throw new ApiError(response.status, error);
  return data;
}
