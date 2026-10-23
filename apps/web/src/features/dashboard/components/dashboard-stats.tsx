"use client";

import { FolderKanban, ShieldAlert, ShieldCheck, Siren } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard } from "@/components/shared/stat-card";
import { Card } from "@/components/ui/card";
import { useDashboardSummary } from "../hooks/use-dashboard";

/** Headline counts for the Organization. */
export function DashboardStats() {
  const { data, error, refetch } = useDashboardSummary();

  if (error) {
    return (
      <Card className="py-0">
        <ErrorState
          title="Could not load the summary"
          description={error.message}
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
        label="Projects"
        value={data?.projectsCount}
        hint={status && `${status.IN_PROGRESS} in progress`}
        icon={FolderKanban}
      />
      <StatCard
        label="Findings"
        value={data?.findingsCount}
        hint="Across every Project"
        icon={ShieldAlert}
      />
      <StatCard
        label="Critical and high"
        value={severity && severity.CRITICAL + severity.HIGH}
        hint={severity && `${severity.CRITICAL} critical`}
        icon={Siren}
      />
      <StatCard
        label="Completed Projects"
        value={status?.COMPLETED}
        hint={status && `${status.PLANNED} planned`}
        icon={ShieldCheck}
      />
    </div>
  );
}
