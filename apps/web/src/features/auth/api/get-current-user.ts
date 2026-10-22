import "server-only";
import { cache } from "react";
import { ApiError } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";
import type { CurrentUser } from "@/lib/api/types";

/**
 * The signed-in User for this request, or null without a valid session.
 * Cached per request, so layouts and pages can all ask for it.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/auth/me");
  if (response.status === 401) return null;
  if (!data) throw new ApiError(response.status, error);
  return data;
});
