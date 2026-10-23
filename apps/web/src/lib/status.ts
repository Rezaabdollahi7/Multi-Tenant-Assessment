import type { StatusTone } from "@/assets/types/common";
import type { FindingStatus } from "@/assets/types/finding";
import type { ProjectStatus } from "@/assets/types/project";

export const PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ARCHIVED",
] as const satisfies readonly ProjectStatus[];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNED: "برنامه‌ریزی‌شده",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل‌شده",
  ARCHIVED: "بایگانی‌شده",
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

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  OPEN: "باز",
  IN_REVIEW: "در حال بررسی",
  RESOLVED: "رفع‌شده",
  ACCEPTED: "ریسک پذیرفته‌شده",
};

export const FINDING_STATUS_TONES: Record<FindingStatus, StatusTone> = {
  OPEN: "neutral",
  IN_REVIEW: "active",
  RESOLVED: "positive",
  ACCEPTED: "inactive",
};
