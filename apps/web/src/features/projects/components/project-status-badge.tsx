import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ProjectStatus } from "@/lib/api/types";
import { PROJECT_STATUS_TONES } from "@/lib/status";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const t = useTranslations("projectStatus");
  return <StatusBadge label={t(status)} tone={PROJECT_STATUS_TONES[status]} />;
}
