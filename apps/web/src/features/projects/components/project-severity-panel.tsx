import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BreakdownList } from "@/components/shared/breakdown-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { Button } from "@/components/ui/button";
import type { ProjectDetail } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_COLORS, SEVERITY_LABELS } from "@/lib/severity";

export function ProjectSeverityPanel({ project }: { project: ProjectDetail }) {
  return (
    <Panel
      title="Findings by Severity"
      action={
        project.findingsCount > 0 && (
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings({ projectId: project.id })}>
              View Findings
            </Link>
          </Button>
        )
      }
    >
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
