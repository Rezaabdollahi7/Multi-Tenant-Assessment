import type { FindingStatus, ProjectStatus } from "@/lib/api/types";

/** How a status reads at a glance: not started, under way, done, or set aside. */
export type StatusTone = "neutral" | "active" | "positive" | "inactive";

export const PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const satisfies readonly ProjectStatus[];

export const PROJECT_STATUS_TONES: Record<ProjectStatus, StatusTone> = {
  PLANNED: "neutral",
  IN_PROGRESS: "active",
  COMPLETED: "positive",
  ARCHIVED: "inactive",
};

export const FINDING_STATUSES = [
  "OPEN",
  "IN_REVIEW",
  "RESOLVED",
  "ACCEPTED",
] as const satisfies readonly FindingStatus[];

export const FINDING_STATUS_TONES: Record<FindingStatus, StatusTone> = {
  OPEN: "neutral",
  IN_REVIEW: "active",
  RESOLVED: "positive",
  ACCEPTED: "inactive",
};
