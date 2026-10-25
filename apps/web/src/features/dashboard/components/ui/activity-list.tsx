"use client";

import type { Activity } from "@/assets/types/dashboard";
import { useNow } from "@/hooks/use-now";
import { ActivityItem } from "./activity-item";

export function ActivityList({ activities }: { activities: Activity[] }) {
  const now = useNow();
  return (
    <ol className="space-y-1">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} now={now} />
      ))}
    </ol>
  );
}
