import { ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { DetailList } from "@/components/shared/detail-list";
import { Panel } from "@/components/shared/panel";
import { SeverityBadge } from "@/components/shared/severity-badge";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "./finding-status-badge";

type FindingDetailsProps = {
  finding: Finding;
  /** Edit and delete controls, shown only with the Permissions for them. */
  actions?: ReactNode;
};

export function FindingDetails({ finding, actions }: FindingDetailsProps) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <nav aria-label={t("common.breadcrumb")}>
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link
                href={routes.findings()}
                className="rounded-sm hover:text-foreground hover:underline"
              >
                {t("nav.findings")}
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

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel
          title={t("findings.details.description")}
          className="lg:col-span-2"
        >
          {finding.description ? (
            // User-written text reads in its own direction.
            <p dir="auto" className="leading-loose whitespace-pre-wrap">
              {finding.description}
            </p>
          ) : (
            <p className="text-muted-foreground">
              {t("findings.details.noDescription")}
            </p>
          )}
        </Panel>
        <Panel title={t("findings.details.info")}>
          <DetailList
            details={[
              {
                label: t("findings.details.project"),
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
                label: t("findings.details.reportedBy"),
                value: (
                  <bdi>{finding.createdBy.name ?? t("common.unnamedUser")}</bdi>
                ),
              },
              {
                label: t("findings.details.reported"),
                value: (
                  <time dateTime={finding.createdAt}>
                    {format.dateTime(new Date(finding.createdAt), "date")}
                  </time>
                ),
              },
              {
                label: t("findings.details.lastUpdated"),
                value: (
                  <time dateTime={finding.updatedAt}>
                    {format.dateTime(new Date(finding.updatedAt), "dateTime")}
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
