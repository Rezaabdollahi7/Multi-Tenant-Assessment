import { ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { errorMessage, settle } from "@/lib/api/api-error";
import { SEVERITIES, SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/severity";
import { getSummary } from "../../lib/dashboard-api";
import { BreakdownSkeleton } from "../ui/skeleton/breakdown-skeleton";

export function SeverityBreakdown({ className }: { className?: string }) {
  return (
    <Panel
      title="یافته‌ها بر اساس شدت"
      description="همهٔ یافته‌های سازمان"
      className={className}
    >
      <Suspense fallback={<BreakdownSkeleton rows={SEVERITIES.length} />}>
        <SeverityBreakdownContent />
      </Suspense>
    </Panel>
  );
}

async function SeverityBreakdownContent() {
  const summary = await settle(getSummary());
  if (!summary.ok) {
    return (
      <ErrorState
        title="تفکیک شدت بارگذاری نشد"
        description={errorMessage(summary.error)}
      />
    );
  }
  if (summary.data.findingsCount === 0) {
    return <EmptyState icon={ShieldCheck} title="هنوز یافته‌ای ثبت نشده است" />;
  }
  return (
    <BreakdownList
      items={SEVERITIES.map((severity) => ({
        id: severity,
        label: SEVERITY_LABELS[severity],
        value: summary.data.severityBreakdown[severity],
        color: SEVERITY_COLORS[severity],
      }))}
    />
  );
}
