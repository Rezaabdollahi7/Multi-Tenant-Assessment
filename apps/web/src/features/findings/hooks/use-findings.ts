import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateFindingInput, UpdateFindingInput } from "@/lib/api/types";
import { QUERY_ROOTS } from "@/lib/query-keys";
import {
  createFinding,
  deleteFinding,
  findingKeys,
  listFindings,
  listProjectOptions,
  updateFinding,
} from "../api/findings-api";
import type { FindingListParams } from "../schemas";

/** Keeps showing the previous page while the next one loads. */
export function useFindings(params: FindingListParams) {
  return useQuery({
    queryKey: findingKeys.list(params),
    queryFn: () => listFindings(params),
    placeholderData: keepPreviousData,
  });
}

export function useProjectOptions() {
  return useQuery({
    queryKey: findingKeys.projectOptions(),
    queryFn: listProjectOptions,
    staleTime: 5 * 60_000,
  });
}

/** A Finding change moves the Dashboard's and Projects' counts too. */
function useInvalidateAfterFindingChange() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all(
      [QUERY_ROOTS.findings, QUERY_ROOTS.dashboard, QUERY_ROOTS.projects].map(
        (root) => queryClient.invalidateQueries({ queryKey: [root] }),
      ),
    );
}

export function useCreateFinding() {
  const invalidate = useInvalidateAfterFindingChange();
  return useMutation({
    mutationFn: (body: CreateFindingInput) => createFinding(body),
    onSuccess: invalidate,
  });
}

export function useUpdateFinding(id: string) {
  const invalidate = useInvalidateAfterFindingChange();
  return useMutation({
    mutationFn: (body: UpdateFindingInput) => updateFinding(id, body),
    onSuccess: invalidate,
  });
}

export function useDeleteFinding(id: string) {
  const invalidate = useInvalidateAfterFindingChange();
  return useMutation({
    mutationFn: () => deleteFinding(id),
    onSuccess: invalidate,
  });
}
