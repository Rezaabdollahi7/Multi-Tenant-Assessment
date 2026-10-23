"use client";

import { FolderKanban } from "lucide-react";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/status";
import { useDashboardSummary } from "../hooks/use-dashboard";
import { BreakdownSkeleton } from "./breakdown-skeleton";

export function ProjectStatusBreakdown({ className }: { className?: string }) {
  const { data, error, refetch } = useDashboardSummary();

  return (
    <Panel
      title="Project Status"
      description="Where each Project is in its life"
      className={className}
    >
      {error ? (
        <ErrorState
          title="Could not load the Project Status breakdown"
          description={error.message}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <BreakdownSkeleton rows={PROJECT_STATUSES.length} />
      ) : data.projectsCount === 0 ? (
        <EmptyState icon={FolderKanban} title="No Projects yet" />
      ) : (
        <BreakdownList
          items={PROJECT_STATUSES.map((status) => ({
            id: status,
            label: PROJECT_STATUS_LABELS[status],
            value: data.projectStatusBreakdown[status],
            color: "var(--primary)",
          }))}
        />
      )}
    </Panel>
  );
}
