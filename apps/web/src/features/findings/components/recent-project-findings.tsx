import { ShieldCheck } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import type { FindingList } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "./finding-status-badge";

type RecentProjectFindingsProps = {
  projectId: string;
  findings: FindingList;
};

/** The latest Findings of one Project, linking to the full filtered list. */
export function RecentProjectFindings({
  projectId,
  findings: { data, meta },
}: RecentProjectFindingsProps) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <Panel
      title={t("findings.latest.title")}
      description={
        meta.totalItems > data.length
          ? t("findings.latest.description", {
              shown: data.length,
              total: meta.totalItems,
            })
          : undefined
      }
      action={
        meta.totalItems > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings({ projectId })}>
              {t("common.viewAll")}
            </Link>
          </Button>
        )
      }
    >
      {data.length === 0 ? (
        <EmptyState icon={ShieldCheck} title={t("findings.latest.empty")} />
      ) : (
        <ul className="-mx-3 space-y-1">
          {data.map((finding) => (
            <li
              key={finding.id}
              className="flex flex-col gap-2 rounded-3xl px-3 py-2.5 transition-colors hover:bg-highlight-subtle sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <Link
                  href={routes.finding(finding.id)}
                  className="rounded-sm text-sm font-medium underline-offset-4 hover:underline"
                >
                  <bdi>{finding.title}</bdi>
                </Link>
                <p className="text-xs text-muted-foreground">
                  {t("findings.latest.reported", {
                    date: format.dateTime(new Date(finding.createdAt), "date"),
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <SeverityBadge severity={finding.severity} />
                <FindingStatusBadge status={finding.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
