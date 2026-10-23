import { ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Card } from "@/components/ui/card";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "./finding-status-badge";

const LINK_CLASSES =
  "rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

type FindingDetailsProps = {
  finding: Finding;
  /** Edit and delete controls, shown only with the Permissions for them. */
  actions?: ReactNode;
};

export function FindingDetails({ finding, actions }: FindingDetailsProps) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <nav aria-label={t("common.breadcrumb")}>
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link
                href={routes.findings()}
                className={`hover:text-foreground ${LINK_CLASSES}`}
              >
                {t("nav.findings")}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </li>
            <li aria-current="page" className="truncate text-foreground">
              {finding.title}
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="max-w-3xl text-xl font-semibold">{finding.title}</h1>
          {actions}
        </div>
        <div className="flex flex-wrap gap-2">
          <SeverityBadge severity={finding.severity} />
          <FindingStatusBadge status={finding.status} />
        </div>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card className="px-5 py-5 lg:col-span-2">
          <section aria-labelledby="finding-description" className="space-y-2">
            <h2 id="finding-description" className="font-semibold">
              {t("findings.details.description")}
            </h2>
            {finding.description ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {finding.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("findings.details.noDescription")}
              </p>
            )}
          </section>
        </Card>
        <Card className="px-5 py-5">
          <dl className="grid gap-4 text-sm">
            <Detail label={t("findings.details.project")}>
              <Link
                href={routes.project(finding.project.id)}
                className={`text-primary ${LINK_CLASSES}`}
              >
                {finding.project.name}
              </Link>
            </Detail>
            <Detail label={t("findings.details.reportedBy")}>
              {finding.createdBy.name ?? t("common.unnamedUser")}
            </Detail>
            <Detail label={t("findings.details.reported")}>
              <time dateTime={finding.createdAt}>
                {format.dateTime(new Date(finding.createdAt), "dateTime")}
              </time>
            </Detail>
            <Detail label={t("findings.details.lastUpdated")}>
              <time dateTime={finding.updatedAt}>
                {format.dateTime(new Date(finding.updatedAt), "dateTime")}
              </time>
            </Detail>
          </dl>
        </Card>
      </div>
    </article>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
