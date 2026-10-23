import { ArrowUpRight, ChartColumn } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage, settle } from "@/lib/api/api-error";
import { routes } from "@/lib/routes";
import { getFindingTrend } from "../../lib/dashboard-api";
import { FindingTrendChart } from "../ui/finding-trend-chart";

export function FindingTrend({ className }: { className?: string }) {
  return (
    <Panel
      title="روند یافته‌ها"
      description="یافته‌های ثبت‌شده در هر روز، ۳۰ روز گذشته"
      className={className}
      action={
        <Link
          href={routes.findings()}
          aria-label="مشاهدهٔ یافته‌ها"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors hover:bg-card-solid"
        >
          <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      }
    >
      <Suspense
        fallback={<Skeleton aria-busy className="h-72 w-full rounded-2xl" />}
      >
        <FindingTrendContent />
      </Suspense>
    </Panel>
  );
}

async function FindingTrendContent() {
  const trend = await settle(getFindingTrend());
  if (!trend.ok) {
    return (
      <ErrorState
        title="روند یافته‌ها بارگذاری نشد"
        description={errorMessage(trend.error)}
      />
    );
  }
  if (trend.data.every((point) => point.total === 0)) {
    return (
      <EmptyState
        icon={ChartColumn}
        title="در ۳۰ روز گذشته یافته‌ای ثبت نشده است"
      />
    );
  }
  return <FindingTrendChart points={trend.data} />;
}
