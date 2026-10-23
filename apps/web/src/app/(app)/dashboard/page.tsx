import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { FindingTrendChart } from "@/features/dashboard/components/finding-trend-chart";
import { ProjectStatusBreakdown } from "@/features/dashboard/components/project-status-breakdown";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { SeverityBreakdown } from "@/features/dashboard/components/severity-breakdown";
import { Can } from "@/lib/session/session-provider";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("intro")}</p>
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
