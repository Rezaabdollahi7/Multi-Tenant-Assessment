import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DetailList } from "@/components/shared/detail-list";
import { Panel } from "@/components/shared/panel";
import { SeverityBadge } from "@/components/shared/severity-badge";
import type { Finding } from "@/assets/types/finding";
import { formatDate, formatDateTime } from "@/lib/format";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "../ui/finding-status-badge";
import { revealOrder } from "@/lib/motion";

type FindingDetailsProps = {
  finding: Finding;
  /** Edit and delete controls, shown only with the Permissions for them. */
  actions?: ReactNode;
};

export function FindingDetails({ finding, actions }: FindingDetailsProps) {
  return (
    <article className="space-y-8">
      <header className="reveal space-y-4" style={revealOrder(0)}>
        <nav aria-label="مسیر صفحه">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link
                href={routes.findings()}
                className="rounded-sm hover:text-foreground hover:underline"
              >
                یافته‌ها
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </li>
            <li aria-current="page" className="truncate text-foreground">
              <bdi>{finding.title}</bdi>
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl leading-tight font-light">
              <bdi>{finding.title}</bdi>
            </h1>
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={finding.severity} />
              <FindingStatusBadge status={finding.status} />
            </div>
          </div>
          {actions}
        </div>
      </header>

      <div
        className="reveal grid items-start gap-6 lg:grid-cols-3"
        style={revealOrder(1)}
      >
        <Panel title="توضیحات" className="lg:col-span-2">
          {finding.description ? (
            // User-written text reads in its own direction.
            <p dir="auto" className="leading-loose whitespace-pre-wrap">
              {finding.description}
            </p>
          ) : (
            <p className="text-muted-foreground">هنوز توضیحی ثبت نشده است.</p>
          )}
        </Panel>
        <Panel title="دربارهٔ این یافته">
          <DetailList
            details={[
              {
                label: "پروژه",
                value: (
                  <Link
                    href={routes.project(finding.project.id)}
                    className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                  >
                    <bdi>{finding.project.name}</bdi>
                  </Link>
                ),
              },
              {
                label: "ثبت‌کننده",
                value: <bdi>{finding.createdBy.name ?? "کاربر بی‌نام"}</bdi>,
              },
              {
                label: "تاریخ ثبت",
                value: (
                  <time dateTime={finding.createdAt}>
                    {formatDate(finding.createdAt)}
                  </time>
                ),
              },
              {
                label: "آخرین به‌روزرسانی",
                value: (
                  <time dateTime={finding.updatedAt}>
                    {formatDateTime(finding.updatedAt)}
                  </time>
                ),
              },
            ]}
          />
        </Panel>
      </div>
    </article>
  );
}
