import "server-only";
import { cache } from "react";
import { ApiError } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";

/** Another Organization's Finding is a 404; a malformed id is a 400. */
const NOT_FOUND_STATUSES = new Set([400, 404]);

/** The Finding, or null when this Organization has none with that id. Cached per request. */
export const getFinding = cache(async (id: string) => {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/findings/{id}", {
    params: { path: { id } },
  });
  if (NOT_FOUND_STATUSES.has(response.status)) return null;
  if (!data) throw new ApiError(response.status, error);
  return data;
});

const RECENT_FINDINGS_LIMIT = 5;

/** A Project's most recent Findings, and how many it has in all. */
export async function getRecentProjectFindings(projectId: string) {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/findings", {
    params: { query: { projectId, limit: RECENT_FINDINGS_LIMIT } },
  });
  if (!data) throw new ApiError(response.status, error);
  return data;
}
