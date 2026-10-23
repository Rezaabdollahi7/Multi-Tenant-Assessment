import type { Metadata } from "next";
import { Can } from "@/lib/session/session-provider";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { FindingTrendChart } from "@/features/dashboard/components/finding-trend-chart";
import { ProjectStatusBreakdown } from "@/features/dashboard/components/project-status-breakdown";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { SeverityBreakdown } from "@/features/dashboard/components/severity-breakdown";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          The security posture of your Organization at a glance.
        </p>
      </header>
      <DashboardStats />
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <FindingTrendChart />
          <Can permission="activity:read">
            <RecentActivity />
          </Can>
        </div>
        <div className="grid gap-6">
          <SeverityBreakdown />
          <ProjectStatusBreakdown />
        </div>
      </div>
    </div>
  );
}
