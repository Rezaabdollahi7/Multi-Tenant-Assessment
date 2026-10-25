import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { H1 } from "@/components/shared/typography";
import type { Finding } from "@/assets/types/finding";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "./finding-status-badge";

type FindingHeaderProps = {
  finding: Finding;
  actions?: ReactNode;
};

export function FindingHeader({ finding, actions }: FindingHeaderProps) {
  return (
    <header className="space-y-4">
      <Breadcrumb
        items={[
          { label: "یافته‌ها", href: routes.findings() },
          { label: <bdi>{finding.title}</bdi> },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <H1 className="max-w-4xl text-4xl leading-tight font-light text-start">
            <bdi>{finding.title}</bdi>
          </H1>
          <div className="flex flex-wrap gap-2">
            <SeverityBadge severity={finding.severity} />
            <FindingStatusBadge status={finding.status} />
          </div>
        </div>
        {actions}
      </div>
    </header>
  );
}
