"use client";

import { FolderKanban, ShieldAlert, Siren } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { HeadlineStat } from "@/components/shared/headline-stat";
import {
  SegmentedBar,
  type SegmentTone,
} from "@/components/shared/segmented-bar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorMessage } from "@/hooks/use-error-message";
import type { ProjectStatus } from "@/lib/api/types";
import { PROJECT_STATUSES } from "@/lib/status";
import { useDashboardSummary } from "../hooks/use-dashboard";

/** Not started reads empty, under way bright, done solid, set aside hatched. */
const STATUS_TONES: Record<ProjectStatus, SegmentTone> = {
  PLANNED: "outline",
  IN_PROGRESS: "highlight",
  COMPLETED: "ink",
  ARCHIVED: "hatch",
};

/** Project Status as one segmented bar, beside the headline counts. */
export function DashboardOverview() {
  const { data, error, refetch } = useDashboardSummary();
  const t = useTranslations();
  const errorMessage = useErrorMessage();
  const statusHeadingId = useId();

  if (error) {
    return (
      <Card className="py-0">
        <ErrorState
          title={t("dashboard.overview.error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      </Card>
    );
  }

  const severity = data?.severityBreakdown;
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <section aria-labelledby={statusHeadingId} className="max-w-3xl">
        <h2 id={statusHeadingId} className="sr-only">
          {t("dashboard.overview.projectStatus")}
        </h2>
        {data ? (
          <SegmentedBar
            segments={PROJECT_STATUSES.map((status) => ({
              id: status,
              label: t(`projectStatus.${status}`),
              value: data.projectStatusBreakdown[status],
              tone: STATUS_TONES[status],
            }))}
            describeValue={(count) =>
              t("dashboard.overview.projectCount", { count })
            }
          />
        ) : (
          <Skeleton aria-busy className="h-[4.25rem] w-full rounded-full" />
        )}
      </section>
      <dl
        aria-label={t("dashboard.overview.label")}
        className="flex flex-wrap gap-x-10 gap-y-4"
      >
        <HeadlineStat
          label={t("dashboard.overview.projects")}
          value={data?.projectsCount}
          icon={FolderKanban}
        />
        <HeadlineStat
          label={t("dashboard.overview.findings")}
          value={data?.findingsCount}
          icon={ShieldAlert}
        />
        <HeadlineStat
          label={t("dashboard.overview.criticalAndHigh")}
          value={severity && severity.CRITICAL + severity.HIGH}
          icon={Siren}
        />
      </dl>
    </div>
  );
}
