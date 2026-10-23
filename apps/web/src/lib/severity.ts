import type { FindingSeverity } from "@/assets/types/finding";

export const SEVERITIES = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFO",
] as const satisfies readonly FindingSeverity[];

export const SEVERITY_LABELS: Record<FindingSeverity, string> = {
  CRITICAL: "بحرانی",
  HIGH: "بالا",
  MEDIUM: "متوسط",
  LOW: "پایین",
  INFO: "اطلاعاتی",
};

export const SEVERITY_COLORS: Record<FindingSeverity, string> = {
  CRITICAL: "var(--severity-critical)",
  HIGH: "var(--severity-high)",
  MEDIUM: "var(--severity-medium)",
  LOW: "var(--severity-low)",
  INFO: "var(--severity-info)",
};
