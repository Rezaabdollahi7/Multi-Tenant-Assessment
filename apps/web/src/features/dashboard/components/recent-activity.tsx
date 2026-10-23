"use client";

import {
  History,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
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

const ACTION_ICONS: Record<Activity["action"], LucideIcon> = {
  "finding.created": PlusIcon,
  "finding.updated": PencilIcon,
  "finding.deleted": Trash2Icon,
};

const PLACEHOLDER_ROWS = 6;
const ONE_MINUTE = 60_000;

export function RecentActivity({ className }: { className?: string }) {
  const { data, error, refetch } = useRecentActivities();
  const t = useTranslations("dashboard.activity");
  const errorMessage = useErrorMessage();

  return (
    <Panel
      variant="ink"
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
            <Skeleton key={index} className="h-10 w-full bg-ink-subtle" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={History} title={t("empty")} />
      ) : (
        <ol className="space-y-1">
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
  const Icon = ACTION_ICONS[action];

  return (
    <li className="flex items-center gap-3 rounded-2xl py-2 text-sm">
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-subtle"
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="line-clamp-2">
          {t.rich(`dashboard.activity.${ACTION_KEYS[action]}`, {
            actor: actor.name ?? t("common.unnamedUser"),
            target: target.name,
            name: (chunks: ReactNode) => (
              <bdi className="font-medium">{chunks}</bdi>
            ),
            // A deleted Finding has no page to link to.
            link: (chunks: ReactNode) =>
              deleted ? (
                <bdi className="text-ink-muted line-through">{chunks}</bdi>
              ) : (
                <Link
                  href={routes.finding(target.id)}
                  className="rounded-sm underline decoration-ink-muted underline-offset-4 hover:decoration-ink-foreground"
                >
                  <bdi>{chunks}</bdi>
                </Link>
              ),
          })}
        </p>
        <time
          dateTime={createdAt}
          title={format.dateTime(new Date(createdAt), "dateTime")}
          className="block text-xs text-ink-muted tabular-nums"
        >
          {format.relativeTime(new Date(createdAt), now)}
        </time>
      </div>
    </li>
  );
}
