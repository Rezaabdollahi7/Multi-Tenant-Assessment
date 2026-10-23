"use client";

import { History } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { Activity } from "@/lib/api/types";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { displayName } from "@/lib/users";
import { useRecentActivities } from "../hooks/use-dashboard";

const ACTION_PHRASES: Record<Activity["action"], string> = {
  "finding.created": "reported",
  "finding.updated": "updated",
  "finding.deleted": "deleted",
};

const PLACEHOLDER_ROWS = 5;

export function RecentActivity({ className }: { className?: string }) {
  const { data, error, refetch } = useRecentActivities();

  return (
    <Panel
      title="Recent Activity"
      description="The latest changes to Findings"
      className={className}
    >
      {error ? (
        <ErrorState
          title="Could not load recent Activity"
          description={error.message}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <div className="space-y-4" aria-busy>
          {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={History} title="No Activity yet" />
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
  const { actor, action, target, createdAt } = activity;
  return (
    <li className="flex flex-col gap-0.5 py-2.5 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <p className="min-w-0">
        <span className="font-medium">{displayName(actor.name)}</span>{" "}
        {ACTION_PHRASES[action]}{" "}
        {action === "finding.deleted" ? (
          <span className="text-muted-foreground">{target.name}</span>
        ) : (
          <Link
            href={routes.finding(target.id)}
            className="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {target.name}
          </Link>
        )}
      </p>
      <time
        dateTime={createdAt}
        title={formatDateTime(createdAt)}
        className="shrink-0 text-xs text-muted-foreground tabular-nums"
      >
        {formatRelativeTime(createdAt)}
      </time>
    </li>
  );
}
