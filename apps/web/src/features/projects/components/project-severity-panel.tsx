import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import type { ProjectDetail } from "@/lib/api/types";
import { SEVERITIES, SEVERITY_COLORS } from "@/lib/severity";

export function ProjectSeverityPanel({ project }: { project: ProjectDetail }) {
  const t = useTranslations();
  return (
    <Panel title={t("projects.details.severityTitle")}>
      {project.findingsCount === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={t("projects.details.emptyFindings")}
        />
      ) : (
        <BreakdownList
          items={SEVERITIES.map((severity) => ({
            id: severity,
            label: t(`severity.${severity}`),
            value: project.severityBreakdown[severity],
            color: SEVERITY_COLORS[severity],
          }))}
        />
      )}
    </Panel>
  );
}
