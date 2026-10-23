import { unwrap } from "@/lib/api/api-error";
import { api } from "@/lib/api/client";
import type { CreateFindingInput, UpdateFindingInput } from "@/lib/api/types";
import { QUERY_ROOTS } from "@/lib/query-keys";
import type { FindingListParams } from "../schemas";

export const FINDINGS_PAGE_SIZE = 10;

/** The API's largest page; Organizations here have far fewer Projects. */
const PROJECT_OPTIONS_LIMIT = 100;

export const findingKeys = {
  all: [QUERY_ROOTS.findings] as const,
  list: (params: FindingListParams) =>
    [...findingKeys.all, "list", params] as const,
  projectOptions: () => [...findingKeys.all, "project-options"] as const,
};

export function listFindings(params: FindingListParams) {
  return unwrap(
    api.GET("/api/findings", {
      params: { query: { ...params, limit: FINDINGS_PAGE_SIZE } },
    }),
  );
}

/** Every Project in the Organization, for filtering and for choosing where a Finding belongs. */
export async function listProjectOptions() {
  const { data } = await unwrap(
    api.GET("/api/projects", {
      params: { query: { limit: PROJECT_OPTIONS_LIMIT } },
    }),
  );
  return data.map(({ id, name }) => ({ value: id, label: name }));
}

export function createFinding(body: CreateFindingInput) {
  return unwrap(api.POST("/api/findings", { body }));
}

export function updateFinding(id: string, body: UpdateFindingInput) {
  return unwrap(
    api.PATCH("/api/findings/{id}", { params: { path: { id } }, body }),
  );
}

export function deleteFinding(id: string) {
  return unwrap(api.DELETE("/api/findings/{id}", { params: { path: { id } } }));
}
