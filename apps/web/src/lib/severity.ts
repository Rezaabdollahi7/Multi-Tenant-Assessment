import type { FindingSeverity } from "@/lib/api/types";

/** Most to least serious; every list and chart uses this order. */
export const SEVERITIES = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFO",
] as const satisfies readonly FindingSeverity[];

export const SEVERITY_LABELS: Record<FindingSeverity, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  INFO: "Info",
};

/** The solid colour of each level, for bars and indicators (see docs/design-system.md). */
export const SEVERITY_COLORS: Record<FindingSeverity, string> = {
  CRITICAL: "var(--severity-critical)",
  HIGH: "var(--severity-high)",
  MEDIUM: "var(--severity-medium)",
  LOW: "var(--severity-low)",
  INFO: "var(--severity-info)",
};
