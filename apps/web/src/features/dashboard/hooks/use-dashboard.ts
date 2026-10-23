import { useQuery } from "@tanstack/react-query";
import {
  dashboardKeys,
  getFindingTrend,
  getRecentActivities,
  getSummary,
} from "../api/dashboard-api";

export function useDashboardSummary() {
  return useQuery({ queryKey: dashboardKeys.summary(), queryFn: getSummary });
}

export function useFindingTrend() {
  return useQuery({
    queryKey: dashboardKeys.trend(),
    queryFn: getFindingTrend,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: getRecentActivities,
  });
}
