"use client";

import { History } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorMessage } from "@/hooks/use-error-message";
import type { Activity } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { useRecentActivities } from "../hooks/use-dashboard";

/** Message keys under `dashboard.activity`, one sentence per action. */
const ACTION_KEYS = {
  "finding.created": "created",
  "finding.updated": "updated",
  "finding.deleted": "deleted",
} as const satisfies Record<Activity["action"], string>;

const PLACEHOLDER_ROWS = 5;
const ONE_MINUTE = 60_000;

export function RecentActivity({ className }: { className?: string }) {
  const { data, error, refetch } = useRecentActivities();
  const t = useTranslations("dashboard.activity");
  const errorMessage = useErrorMessage();

  return (
    <Panel
      title={t("title")}
      description={t("description")}
      className={className}
    >
      {error ? (
        <ErrorState
          title={t("error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <div className="space-y-4" aria-busy>
          {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={History} title={t("empty")} />
      ) : (
        <ol className="divide-y">
          {data.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ol>
      )}
    </Panel>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const t = useTranslations();
  const format = useFormatter();
  // Re-renders every minute so "just now" moves on to "1 minute ago".
  const now = useNow({ updateInterval: ONE_MINUTE });
  const { actor, action, target, createdAt } = activity;
  const deleted = action === "finding.deleted";

  return (
    <li className="flex flex-col gap-0.5 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <p className="min-w-0">
        {t.rich(`dashboard.activity.${ACTION_KEYS[action]}`, {
          actor: actor.name ?? t("common.unnamedUser"),
          target: target.name,
          name: (chunks: ReactNode) => (
            <span className="font-medium">{chunks}</span>
          ),
          // A deleted Finding has no page to link to.
          link: (chunks: ReactNode) =>
            deleted ? (
              <span className="text-muted-foreground">{chunks}</span>
            ) : (
              <Link
                href={routes.finding(target.id)}
                className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {chunks}
              </Link>
            ),
        })}
      </p>
      <time
        dateTime={createdAt}
        title={format.dateTime(new Date(createdAt), "dateTime")}
        className="shrink-0 text-xs text-muted-foreground tabular-nums"
      >
        {format.relativeTime(new Date(createdAt), now)}
      </time>
    </li>
  );
}
