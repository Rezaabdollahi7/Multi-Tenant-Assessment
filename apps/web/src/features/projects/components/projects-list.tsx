"use client";

import { FolderSearch } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useErrorMessage } from "@/hooks/use-error-message";
import { useListParams } from "@/hooks/use-list-params";
import type { Project } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { PROJECT_STATUSES } from "@/lib/status";
import { useProjects } from "../hooks/use-projects";
import { projectListParamsSchema } from "../schemas";
import { ProjectStatusBadge } from "./project-status-badge";

/** The Organization's Projects, searchable, filterable by Project Status, paginated. */
export function ProjectsList() {
  const { params, hrefWith, update } = useListParams(projectListParamsSchema);
  const { data, error, refetch } = useProjects(params);
  const t = useTranslations();
  const format = useFormatter();
  const errorMessage = useErrorMessage();

  const statusOptions = PROJECT_STATUSES.map((status) => ({
    value: status,
    label: t(`projectStatus.${status}`),
  }));
  const columns: DataTableColumn<Project>[] = [
    {
      id: "name",
      header: t("projects.columns.project"),
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
      header: t("projects.columns.status"),
      cell: (project) => <ProjectStatusBadge status={project.status} />,
    },
    {
      id: "findings",
      header: t("projects.columns.findings"),
      cell: (project) => format.number(project.findingsCount),
      className: "text-end tabular-nums",
    },
    {
      id: "members",
      header: t("projects.columns.members"),
      cell: (project) => format.number(project.membersCount),
      className: "hidden text-end tabular-nums sm:table-cell",
    },
    {
      id: "created",
      header: t("projects.columns.created"),
      cell: (project) => format.dateTime(new Date(project.createdAt), "date"),
      className: "hidden md:table-cell",
    },
  ];
  const filtered = params.search !== undefined || params.status !== undefined;

  return (
    <Card className="gap-4 rounded-3xl p-4 sm:p-6">
      <div role="search" className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label={t("projects.search")}
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="sm:max-w-xs sm:flex-1"
        />
        <FilterSelect
          label={t("projects.statusFilter")}
          allLabel={t("projects.allStatuses")}
          options={statusOptions}
          value={params.status}
          onChange={(status) => update({ status })}
        />
      </div>

      <div>
        {error ? (
          <ErrorState
            title={t("projects.error")}
            description={errorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title={filtered ? t("projects.emptyFiltered") : t("projects.empty")}
            action={
              filtered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    update({ search: undefined, status: undefined })
                  }
                >
                  {t("common.clearFilters")}
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption={t("projects.caption")}
            columns={columns}
            rows={data?.data}
            getRowId={(project) => project.id}
          />
        )}
      </div>

      {data && data.meta.totalItems > 0 && (
        <Pagination
          meta={data.meta}
          totalLabel={t("projects.count", { count: data.meta.totalItems })}
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </Card>
  );
}
