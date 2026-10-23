import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/block/dashboard-overview";
import { FindingTrend } from "@/features/dashboard/components/block/finding-trend";
import { RecentActivity } from "@/features/dashboard/components/block/recent-activity";
import { SeverityBreakdown } from "@/features/dashboard/components/block/severity-breakdown";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { revealOrder } from "@/lib/motion";
import { can } from "@/lib/session/permissions";

export const metadata: Metadata = { title: "داشبورد" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const firstName = user?.name?.split(/\s+/)[0] ?? "کاربر بی‌نام";

  return (
    <div className="space-y-8">
      <header className="reveal space-y-2" style={revealOrder(0)}>
        <h1 className="text-display font-light">{firstName}، خوش آمدید</h1>
        <p className="text-muted-foreground">
          نمای کلی وضعیت امنیتی {user?.organization.name}.
        </p>
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
