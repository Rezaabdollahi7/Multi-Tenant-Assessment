import type { ProjectStatus } from "@/lib/api/types";

/** How a status reads at a glance: not started, under way, done, or set aside. */
export type StatusTone = "neutral" | "active" | "positive" | "inactive";

export const PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const satisfies readonly ProjectStatus[];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export const PROJECT_STATUS_TONES: Record<ProjectStatus, StatusTone> = {
  PLANNED: "neutral",
  IN_PROGRESS: "active",
  COMPLETED: "positive",
  ARCHIVED: "inactive",
};
