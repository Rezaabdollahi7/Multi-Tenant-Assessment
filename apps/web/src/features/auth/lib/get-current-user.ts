import "server-only";
import { cache } from "react";
import type { CurrentUser } from "@/assets/types/user";
import { ApiError } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const api = await serverApi();
  const { data, error, response } = await api.GET("/api/auth/me");
  if (response.status === 401) return null;
  if (!data) throw new ApiError(response.status, error);
  return data;
});
