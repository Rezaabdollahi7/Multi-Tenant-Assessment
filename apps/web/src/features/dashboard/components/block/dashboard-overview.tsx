import { Suspense } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { errorMessage, settle } from "@/lib/api/api-error";
import { getSummary } from "../../lib/dashboard-api";
import { OverviewFigures } from "../ui/overview-figures";

export function DashboardOverview() {
  return (
    <Suspense fallback={<OverviewFigures />}>
      <OverviewContent />
    </Suspense>
  );
}

async function OverviewContent() {
  const summary = await settle(getSummary());
  if (!summary.ok) {
    return (
      <Card className="py-0">
        <ErrorState
          title="خلاصه بارگذاری نشد"
          description={errorMessage(summary.error)}
        />
      </Card>
    );
  }
  return <OverviewFigures summary={summary.data} />;
}
