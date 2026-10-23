import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProjects, projectKeys } from "../api/projects-api";
import type { ProjectListParams } from "../schemas";

/** Keeps showing the previous page while the next one loads. */
export function useProjects(params: ProjectListParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => listProjects(params),
    placeholderData: keepPreviousData,
  });
}
