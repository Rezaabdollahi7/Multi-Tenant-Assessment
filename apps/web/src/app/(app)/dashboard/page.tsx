import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { FindingTrendChart } from "@/features/dashboard/components/finding-trend-chart";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { SeverityBreakdown } from "@/features/dashboard/components/severity-breakdown";
import { Can } from "@/lib/session/session-provider";
import { revealOrder } from "@/lib/motion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const [t, user] = await Promise.all([getTranslations(), getCurrentUser()]);
  const firstName = user?.name?.split(/\s+/)[0] ?? t("common.unnamedUser");

  return (
    <div className="space-y-8">
      <header className="reveal space-y-2" style={revealOrder(0)}>
        <h1 className="text-display font-light">
          {t("dashboard.welcome", { name: firstName })}
        </h1>
        <p className="text-muted-foreground">
          {t("dashboard.intro", {
            organization: user?.organization.name ?? "",
          })}
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
          <FindingTrendChart />
          <SeverityBreakdown />
        </div>
        <Can permission="activity:read">
          <RecentActivity />
        </Can>
      </div>
    </div>
  );
}
