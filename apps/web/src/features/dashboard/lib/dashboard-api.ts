import "server-only";
import { cache } from "react";
import { unwrap } from "@/lib/api/api-error";
import { serverApi } from "@/lib/api/server";

export const getSummary = cache(async () =>
  unwrap((await serverApi()).GET("/api/dashboard/summary")),
);

export async function getFindingTrend() {
  return unwrap((await serverApi()).GET("/api/dashboard/trend"));
}

export async function getRecentActivities() {
  return unwrap((await serverApi()).GET("/api/dashboard/activities"));
}
