import Link from "next/link";
import type { Project } from "@/assets/types/project";
import type { DataTableColumn } from "@/components/shared/data-table";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { ProjectStatusBadge } from "./project-status-badge";

export const PROJECTS_COLUMNS: DataTableColumn<Project>[] = [
  {
    id: "name",
    header: "پروژه",
    cell: (project) => (
      <Link
        href={routes.project(project.id)}
        className="rounded-sm font-medium underline-offset-4 hover:underline"
      >
        <bdi>{project.name}</bdi>
      </Link>
    ),
  },
  {
    id: "status",
    header: "وضعیت پروژه",
    cell: (project) => <ProjectStatusBadge status={project.status} />,
  },
  {
    id: "findings",
    header: "یافته‌ها",
    cell: (project) => formatNumber(project.findingsCount),
    className: "text-end tabular-nums",
  },
  {
    id: "members",
    header: "اعضا",
    cell: (project) => formatNumber(project.membersCount),
    className: "hidden text-end tabular-nums sm:table-cell",
  },
  {
    id: "created",
    header: "تاریخ ایجاد",
    cell: (project) => formatDate(project.createdAt),
    className: "hidden md:table-cell",
  },
];
