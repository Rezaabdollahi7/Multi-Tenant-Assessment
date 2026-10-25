"use client";

import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Activity } from "@/assets/types/dashboard";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { routes } from "@/lib/routes";

const ACTION_VERBS: Record<Activity["action"], string> = {
  "finding.created": "را ثبت کرد",
  "finding.updated": "را ویرایش کرد",
  "finding.deleted": "را حذف کرد",
};

const ACTION_ICONS: Record<Activity["action"], LucideIcon> = {
  "finding.created": PlusIcon,
  "finding.updated": PencilIcon,
  "finding.deleted": Trash2Icon,
};

type ActivityItemProps = {
  activity: Activity;
  now: number | null;
};

export function ActivityItem({ activity, now }: ActivityItemProps) {
  const { actor, action, target, createdAt } = activity;
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
          <bdi className="font-medium">{actor.name ?? "کاربر بی‌نام"}</bdi>{" "}
          یافتهٔ{" "}
          {action === "finding.deleted" ? (
            <bdi className="text-ink-muted line-through">{target.name}</bdi>
          ) : (
            <Link
              href={routes.finding(target.id)}
              className="rounded-sm underline decoration-ink-muted underline-offset-4 hover:decoration-ink-foreground"
            >
              <bdi>{target.name}</bdi>
            </Link>
          )}{" "}
          {ACTION_VERBS[action]}
        </p>
        <time
          dateTime={createdAt}
          title={formatDateTime(createdAt)}
          className="block text-xs text-ink-muted tabular-nums"
        >
          {now === null
            ? formatDateTime(createdAt)
            : formatRelativeTime(createdAt, now)}
        </time>
      </div>
    </li>
  );
}
