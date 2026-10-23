"use client";

import { ShieldCheck } from "lucide-react";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { SEVERITIES, SEVERITY_LABELS, SEVERITY_COLORS } from "@/lib/severity";
import { useDashboardSummary } from "../hooks/use-dashboard";
import { BreakdownSkeleton } from "./breakdown-skeleton";

export function SeverityBreakdown({ className }: { className?: string }) {
  const { data, error, refetch } = useDashboardSummary();

  return (
    <Panel
      title="Findings by Severity"
      description="Every Finding in the Organization"
      className={className}
    >
      {error ? (
        <ErrorState
          title="Could not load the Severity breakdown"
          description={error.message}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <BreakdownSkeleton rows={SEVERITIES.length} />
      ) : data.findingsCount === 0 ? (
        <EmptyState icon={ShieldCheck} title="No Findings reported yet" />
      ) : (
        <BreakdownList
          items={SEVERITIES.map((severity) => ({
            id: severity,
            label: SEVERITY_LABELS[severity],
            value: data.severityBreakdown[severity],
            color: SEVERITY_COLORS[severity],
          }))}
        />
      )}
    </Panel>
  );
}
