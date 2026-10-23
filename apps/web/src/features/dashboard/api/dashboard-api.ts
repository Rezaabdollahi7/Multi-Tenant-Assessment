import { unwrap } from "@/lib/api/api-error";
import { api } from "@/lib/api/client";
import { QUERY_ROOTS } from "@/lib/query-keys";

export const dashboardKeys = {
  all: [QUERY_ROOTS.dashboard] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  trend: () => [...dashboardKeys.all, "trend"] as const,
  activities: () => [...dashboardKeys.all, "activities"] as const,
};

export function getSummary() {
  return unwrap(api.GET("/api/dashboard/summary"));
}

/** The last 30 days, today included (the API's default window). */
export function getFindingTrend() {
  return unwrap(api.GET("/api/dashboard/trend"));
}

/** The 10 most recent Activities (the API's default). */
export function getRecentActivities() {
  return unwrap(api.GET("/api/dashboard/activities"));
}
