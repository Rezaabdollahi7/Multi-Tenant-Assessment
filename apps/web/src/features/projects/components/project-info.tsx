import { useFormatter, useTranslations } from "next-intl";
import { DetailList } from "@/components/shared/detail-list";
import { Panel } from "@/components/shared/panel";
import type { ProjectDetail } from "@/lib/api/types";
import { ProjectStatusBadge } from "./project-status-badge";

export function ProjectInfo({ project }: { project: ProjectDetail }) {
  const t = useTranslations("projects");
  const format = useFormatter();
  return (
    <Panel title={t("details.info")}>
      <DetailList
        details={[
          {
            label: t("columns.status"),
            value: <ProjectStatusBadge status={project.status} />,
          },
          {
            label: t("columns.findings"),
            value: format.number(project.findingsCount),
          },
          {
            label: t("columns.members"),
            value: format.number(project.membersCount),
          },
          {
            label: t("columns.created"),
            value: format.dateTime(new Date(project.createdAt), "date"),
          },
        ]}
      />
    </Panel>
  );
}
