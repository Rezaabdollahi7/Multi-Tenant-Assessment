import type { ProjectStatus } from "@/lib/api/types";

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
