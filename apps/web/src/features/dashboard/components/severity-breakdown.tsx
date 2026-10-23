"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { useErrorMessage } from "@/hooks/use-error-message";
import { SEVERITIES, SEVERITY_COLORS } from "@/lib/severity";
import { useDashboardSummary } from "../hooks/use-dashboard";
import { BreakdownSkeleton } from "./breakdown-skeleton";

export function SeverityBreakdown({ className }: { className?: string }) {
  const { data, error, refetch } = useDashboardSummary();
  const t = useTranslations();
  const errorMessage = useErrorMessage();

  return (
    <Panel
      title={t("dashboard.severity.title")}
      description={t("dashboard.severity.description")}
      className={className}
    >
      {error ? (
        <ErrorState
          title={t("dashboard.severity.error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <BreakdownSkeleton rows={SEVERITIES.length} />
      ) : data.findingsCount === 0 ? (
        <EmptyState icon={ShieldCheck} title={t("dashboard.severity.empty")} />
      ) : (
        <BreakdownList
          items={SEVERITIES.map((severity) => ({
            id: severity,
            label: t(`severity.${severity}`),
            value: data.severityBreakdown[severity],
            color: SEVERITY_COLORS[severity],
          }))}
        />
      )}
    </Panel>
  );
}
