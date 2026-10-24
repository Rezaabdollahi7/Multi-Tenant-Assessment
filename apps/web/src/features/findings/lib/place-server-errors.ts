import type { Path } from "react-hook-form";
import { ApiError } from "@/lib/api/api-error";

export function placeServerErrors<Form extends Record<string, unknown>>(
  error: unknown,
  fields: readonly Path<Form>[],
  setFieldError: (field: Path<Form>, message: string) => void,
): boolean {
  if (!(error instanceof ApiError)) return false;
  let placed = false;
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) {
      setFieldError(field, message);
      placed = true;
    }
  }
  return placed;
}
