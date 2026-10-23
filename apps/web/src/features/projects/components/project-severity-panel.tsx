import { ShieldCheck } from "lucide-react";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import type { ProjectDetail } from "@/lib/api/types";
import { SEVERITIES, SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/severity";

export function ProjectSeverityPanel({ project }: { project: ProjectDetail }) {
  return (
    <Panel title="Findings by Severity">
      {project.findingsCount === 0 ? (
        <EmptyState icon={ShieldCheck} title="No Findings reported yet" />
      ) : (
        <BreakdownList
          items={SEVERITIES.map((severity) => ({
            id: severity,
            label: SEVERITY_LABELS[severity],
            value: project.severityBreakdown[severity],
            color: SEVERITY_COLORS[severity],
          }))}
        />
      )}
    </Panel>
  );
}
