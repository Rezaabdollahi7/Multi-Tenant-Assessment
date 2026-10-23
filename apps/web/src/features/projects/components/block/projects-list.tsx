"use client";

import { FolderSearch } from "lucide-react";
import Link from "next/link";
import type { Project, ProjectList } from "@/assets/types/project";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/status";
import { cn } from "@/lib/utils";
import { projectListParamsSchema } from "../../lib/schemas";
import { ProjectStatusBadge } from "../ui/project-status-badge";

const STATUS_OPTIONS = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABELS[status],
}));

const COLUMNS: DataTableColumn<Project>[] = [
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

export function ProjectsList({ projects }: { projects: ProjectList }) {
  const { params, hrefWith, update, pending } = useListParams(
    projectListParamsSchema,
  );
  const filtered = params.search !== undefined || params.status !== undefined;

  return (
    <Card className="gap-4 rounded-3xl p-4 sm:p-6">
      <div role="search" className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="جست‌وجوی پروژه با نام"
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="sm:max-w-xs sm:flex-1"
        />
        <FilterSelect
          label="وضعیت پروژه"
          allLabel="همهٔ وضعیت‌ها"
          options={STATUS_OPTIONS}
          value={params.status}
          onChange={(status) => update({ status })}
        />
      </div>

      <div
        aria-busy={pending}
        className={cn("transition-opacity", pending && "opacity-60")}
      >
        {projects.data.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title={
              filtered
                ? "هیچ پروژه‌ای با این فیلترها پیدا نشد"
                : "هنوز پروژه‌ای وجود ندارد"
            }
            action={
              filtered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    update({ search: undefined, status: undefined })
                  }
                >
                  پاک کردن فیلترها
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption="پروژه‌ها"
            columns={COLUMNS}
            rows={projects.data}
            getRowId={(project) => project.id}
          />
        )}
      </div>

      {projects.meta.totalItems > 0 && (
        <Pagination
          meta={projects.meta}
          totalLabel={`${formatNumber(projects.meta.totalItems)} پروژه`}
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </Card>
  );
}
