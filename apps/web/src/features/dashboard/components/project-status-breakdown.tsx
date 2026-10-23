"use client";

import { FolderKanban } from "lucide-react";
import { useTranslations } from "next-intl";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { useErrorMessage } from "@/hooks/use-error-message";
import { PROJECT_STATUSES } from "@/lib/status";
import { useDashboardSummary } from "../hooks/use-dashboard";
import { BreakdownSkeleton } from "./breakdown-skeleton";

export function ProjectStatusBreakdown({ className }: { className?: string }) {
  const { data, error, refetch } = useDashboardSummary();
  const t = useTranslations();
  const errorMessage = useErrorMessage();

  return (
    <Panel
      title={t("dashboard.projectStatus.title")}
      description={t("dashboard.projectStatus.description")}
      className={className}
    >
      {error ? (
        <ErrorState
          title={t("dashboard.projectStatus.error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <BreakdownSkeleton rows={PROJECT_STATUSES.length} />
      ) : data.projectsCount === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={t("dashboard.projectStatus.empty")}
        />
      ) : (
        <BreakdownList
          items={PROJECT_STATUSES.map((status) => ({
            id: status,
            label: t(`projectStatus.${status}`),
            value: data.projectStatusBreakdown[status],
            color: "var(--primary)",
          }))}
        />
      )}
    </Panel>
  );
}
