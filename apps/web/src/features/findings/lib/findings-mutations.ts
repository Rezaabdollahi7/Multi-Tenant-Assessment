import type {
  CreateFindingInput,
  UpdateFindingInput,
} from "@/assets/types/finding";
import { unwrap } from "@/lib/api/api-error";
import { api } from "@/lib/api/client";

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
