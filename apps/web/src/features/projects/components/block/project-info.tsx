import { DetailList } from "@/components/shared/detail-list";
import { Panel } from "@/components/shared/panel";
import type { ProjectDetail } from "@/assets/types/project";
import { formatDate, formatNumber } from "@/lib/format";
import { ProjectStatusBadge } from "../ui/project-status-badge";

export function ProjectInfo({ project }: { project: ProjectDetail }) {
  return (
    <Panel title="دربارهٔ این پروژه">
      <DetailList
        details={[
          {
            label: "وضعیت پروژه",
            value: <ProjectStatusBadge status={project.status} />,
          },
          {
            label: "یافته‌ها",
            value: formatNumber(project.findingsCount),
          },
          {
            label: "اعضا",
            value: formatNumber(project.membersCount),
          },
          {
            label: "تاریخ ایجاد",
            value: formatDate(project.createdAt),
          },
        ]}
      />
    </Panel>
  );
}
