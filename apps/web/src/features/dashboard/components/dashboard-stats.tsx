"use client";

import { FolderKanban, ShieldAlert, ShieldCheck, Siren } from "lucide-react";
import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { useErrorMessage } from "@/hooks/use-error-message";
import { useDashboardSummary } from "../hooks/use-dashboard";

/** Headline counts for the Organization. */
export function DashboardStats() {
  const { data, error, refetch } = useDashboardSummary();
  const t = useTranslations("dashboard.stats");
  const errorMessage = useErrorMessage();

  if (error) {
    return (
      <Card className="py-0">
        <ErrorState
          title={t("error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      </Card>
    );
  }

  const severity = data?.severityBreakdown;
  const status = data?.projectStatusBreakdown;
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        label={t("projects")}
        value={data?.projectsCount}
        hint={status && t("projectsHint", { count: status.IN_PROGRESS })}
        icon={FolderKanban}
      />
      <StatCard
        label={t("findings")}
        value={data?.findingsCount}
        hint={t("findingsHint")}
        icon={ShieldAlert}
      />
      <StatCard
        label={t("criticalAndHigh")}
        value={severity && severity.CRITICAL + severity.HIGH}
        hint={
          severity && t("criticalAndHighHint", { count: severity.CRITICAL })
        }
        icon={Siren}
      />
      <StatCard
        label={t("completedProjects")}
        value={status?.COMPLETED}
        hint={status && t("completedProjectsHint", { count: status.PLANNED })}
        icon={ShieldCheck}
      />
    </div>
  );
}
