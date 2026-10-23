import type { ProjectStatus } from "@/assets/types/project";
import { StatusBadge } from "@/components/shared/status-badge";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONES } from "@/lib/status";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <StatusBadge
      label={PROJECT_STATUS_LABELS[status]}
      tone={PROJECT_STATUS_TONES[status]}
    />
  );
}
