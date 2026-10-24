import { H1, Muted } from "@/components/shared/typography";
import { DashboardOverview } from "@/features/dashboard/components/block/dashboard-overview";
import { FindingTrend } from "@/features/dashboard/components/block/finding-trend";
import { RecentActivity } from "@/features/dashboard/components/block/recent-activity";
import { SeverityBreakdown } from "@/features/dashboard/components/block/severity-breakdown";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { revealOrder } from "@/lib/motion";
import { can } from "@/lib/session/permissions";

export default async function page() {
  const user = await getCurrentUser();
  const firstName = user?.name?.split(/\s+/)[0] ?? "کاربر بی‌ نام";

  return (
    <div className="space-y-8">
      <header className="reveal space-y-2" style={revealOrder(0)}>
        <H1 className="text-display font-light text-start">
          {firstName}، خوش امدید
        </H1>
        <Muted>
          نمای کلی وضعیت امنیتی {user?.organization.name}.
        </Muted>
      </header>
      <div className="reveal" style={revealOrder(1)}>
        <DashboardOverview />
      </div>
      <div
        className="reveal grid items-start gap-6 lg:grid-cols-3"
        style={revealOrder(2)}
      >
        <div className="grid gap-6 lg:col-span-2">
          <FindingTrend />
          <SeverityBreakdown />
        </div>
        {can(user, "activity", "read") && <RecentActivity />}
      </div>
    </div>
  );
}
