"use client";

import {
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Activity } from "@/assets/types/dashboard";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";
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

const ONE_MINUTE = 60_000;

export function ActivityList({ activities }: { activities: Activity[] }) {
  const now = useNow();
  return (
    <ol className="space-y-1">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          index={index}
          now={now}
        />
      ))}
    </ol>
  );
}

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, ONE_MINUTE);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return now;
}

function ActivityItem({
  activity,
  index,
  now,
}: {
  activity: Activity;
  index: number;
  now: number | null;
}) {
  const { actor, action, target, createdAt } = activity;
  const Icon = ACTION_ICONS[action];

  return (
    <motion.li
      className="flex items-center gap-3 rounded-2xl py-2 text-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION.base,
        ease: EASE_OUT,
        delay: index * STAGGER,
      }}
    >
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
    </motion.li>
  );
}
