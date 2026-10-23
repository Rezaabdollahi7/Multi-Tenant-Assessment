import "server-only";
import { cache } from "react";
import type { Option } from "@/assets/types/common";
import { ApiError, unwrap } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";
import type { FindingListParams } from "./schemas";

const FINDINGS_PAGE_SIZE = 10;
const RECENT_FINDINGS_LIMIT = 5;
const PROJECT_OPTIONS_LIMIT = 100;
const NOT_FOUND_STATUSES = new Set([400, 404]);

export async function listFindings(params: FindingListParams) {
  return unwrap(
    (await serverApi()).GET("/api/findings", {
      params: { query: { ...params, limit: FINDINGS_PAGE_SIZE } },
    }),
  );
}

export const getFinding = cache(async (id: string) => {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/findings/{id}", {
    params: { path: { id } },
  });
  if (NOT_FOUND_STATUSES.has(response.status)) return null;
  if (!data) throw new ApiError(response.status, error);
  return data;
});

export async function getRecentProjectFindings(projectId: string) {
  return unwrap(
    (await serverApi()).GET("/api/findings", {
      params: { query: { projectId, limit: RECENT_FINDINGS_LIMIT } },
    }),
  );
}

export async function listProjectOptions(): Promise<Option[]> {
  const { data } = await unwrap(
    (await serverApi()).GET("/api/projects", {
      params: { query: { limit: PROJECT_OPTIONS_LIMIT } },
    }),
  );
  return data.map(({ id, name }) => ({ value: id, label: name }));
}
