import Link from "next/link";
import type { Finding } from "@/assets/types/finding";
import type { DataTableColumn } from "@/components/shared/data-table";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { FindingStatusBadge } from "./finding-status-badge";

const LINK_CLASSES = "rounded-sm underline-offset-4 hover:underline";

export const FINDINGS_COLUMNS: DataTableColumn<Finding>[] = [
  {
    id: "title",
    header: "یافته",
    cell: (finding) => (
      <Link
        href={routes.finding(finding.id)}
        className={`font-medium ${LINK_CLASSES}`}
      >
        <bdi>{finding.title}</bdi>
      </Link>
    ),
    className: "max-w-80 whitespace-normal",
  },
  {
    id: "severity",
    header: "شدت",
    cell: (finding) => <SeverityBadge severity={finding.severity} />,
  },
  {
    id: "status",
    header: "وضعیت یافته",
    cell: (finding) => <FindingStatusBadge status={finding.status} />,
    className: "hidden sm:table-cell",
  },
  {
    id: "project",
    header: "پروژه",
    cell: (finding) => (
      <Link href={routes.project(finding.project.id)} className={LINK_CLASSES}>
        <bdi>{finding.project.name}</bdi>
      </Link>
    ),
    className: "hidden md:table-cell",
  },
  {
    id: "reported",
    header: "تاریخ ثبت",
    cell: (finding) => formatDate(finding.createdAt),
    className: "hidden lg:table-cell",
  },
];
