import { History } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage, settle } from "@/lib/api/api-error";
import { getRecentActivities } from "../../lib/dashboard-api";
import { ActivityList } from "../ui/activity-list";

const PLACEHOLDER_ROWS = 6;

export function RecentActivity({ className }: { className?: string }) {
  return (
    <Panel
      variant="ink"
      title="فعالیت‌های اخیر"
      description="آخرین تغییرات یافته‌ها"
      className={className}
    >
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivityContent />
      </Suspense>
    </Panel>
  );
}

async function RecentActivityContent() {
  const activities = await settle(getRecentActivities());
  if (!activities.ok) {
    return (
      <ErrorState
        title="فعالیت‌های اخیر بارگذاری نشد"
        description={errorMessage(activities.error)}
      />
    );
  }
  if (activities.data.length === 0) {
    return <EmptyState icon={History} title="هنوز فعالیتی ثبت نشده است" />;
  }
  return <ActivityList activities={activities.data} />;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
        <Skeleton key={index} className="h-10 w-full bg-ink-subtle" />
      ))}
    </div>
  );
}
