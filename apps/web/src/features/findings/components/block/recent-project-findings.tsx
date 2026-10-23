import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import type { FindingList } from "@/assets/types/finding";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "../ui/finding-status-badge";

type RecentProjectFindingsProps = {
  projectId: string;
  findings: FindingList;
};

/** The latest Findings of one Project, linking to the full filtered list. */
export function RecentProjectFindings({
  projectId,
  findings: { data, meta },
}: RecentProjectFindingsProps) {
  return (
    <Panel
      title="آخرین یافته‌ها"
      description={
        meta.totalItems > data.length
          ? `${formatNumber(data.length)} مورد آخر از ${formatNumber(meta.totalItems)}`
          : undefined
      }
      action={
        meta.totalItems > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings({ projectId })}>مشاهدهٔ همه</Link>
          </Button>
        )
      }
    >
      {data.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="هنوز یافته‌ای ثبت نشده است" />
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
                  ثبت در {formatDate(finding.createdAt)}
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
