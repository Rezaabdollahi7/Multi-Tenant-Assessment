"use client";

import { FolderKanban, ShieldAlert, Siren } from "lucide-react";
import type { DashboardSummary } from "@/assets/types/dashboard";
import type { ProjectStatus } from "@/assets/types/project";
import { HeadlineStat } from "@/components/shared/headline-stat";
import {
  SegmentedBar,
  type SegmentTone,
} from "@/components/shared/segmented-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/status";

const STATUS_TONES: Record<ProjectStatus, SegmentTone> = {
  PLANNED: "outline",
  IN_PROGRESS: "highlight",
  COMPLETED: "ink",
  ARCHIVED: "hatch",
};

export function OverviewFigures({ summary }: { summary?: DashboardSummary }) {
  const severity = summary?.severityBreakdown;
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
      <section aria-labelledby="project-status-heading" className="max-w-3xl">
        <h2 id="project-status-heading" className="sr-only">
          وضعیت پروژه
        </h2>
        {summary ? (
          <SegmentedBar
            segments={PROJECT_STATUSES.map((status) => ({
              id: status,
              label: PROJECT_STATUS_LABELS[status],
              value: summary.projectStatusBreakdown[status],
              tone: STATUS_TONES[status],
            }))}
            describeValue={(count) => `${formatNumber(count)} پروژه`}
          />
        ) : (
          <Skeleton aria-busy className="h-[4.25rem] w-full rounded-full" />
        )}
      </section>
      <dl aria-label="نمای کلی" className="flex flex-wrap gap-x-10 gap-y-4">
        <HeadlineStat
          label="پروژه‌ها"
          value={summary?.projectsCount}
          icon={FolderKanban}
        />
        <HeadlineStat
          label="یافته‌ها"
          value={summary?.findingsCount}
          icon={ShieldAlert}
        />
        <HeadlineStat
          label="بحرانی و بالا"
          value={severity && severity.CRITICAL + severity.HIGH}
          icon={Siren}
        />
      </dl>
    </div>
  );
}
