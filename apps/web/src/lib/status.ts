import type { FindingStatus, ProjectStatus } from "@/lib/api/types";

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

export const FINDING_STATUSES = [
  "OPEN",
  "IN_REVIEW",
  "RESOLVED",
  "ACCEPTED",
] as const satisfies readonly FindingStatus[];

/** `ACCEPTED` is shown as Risk Accepted (see GLOSSARY.md). */
export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  OPEN: "Open",
  IN_REVIEW: "In Review",
  RESOLVED: "Resolved",
  ACCEPTED: "Risk Accepted",
};

export const FINDING_STATUS_TONES: Record<FindingStatus, StatusTone> = {
  OPEN: "neutral",
  IN_REVIEW: "active",
  RESOLVED: "positive",
  ACCEPTED: "inactive",
};
