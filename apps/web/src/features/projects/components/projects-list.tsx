"use client";

import { FolderSearch } from "lucide-react";
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
import { useListParams } from "@/hooks/use-list-params";
import type { Project } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/status";
import { useProjects } from "../hooks/use-projects";
import { projectListParamsSchema } from "../schemas";
import { ProjectStatusBadge } from "./project-status-badge";

const STATUS_OPTIONS = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABELS[status],
}));

const COLUMNS: DataTableColumn<Project>[] = [
  {
    id: "name",
    header: "Project",
    cell: (project) => (
      <Link
        href={routes.project(project.id)}
        className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {project.name}
      </Link>
    ),
  },
  {
    id: "status",
    header: "Project Status",
    cell: (project) => <ProjectStatusBadge status={project.status} />,
  },
  {
    id: "findings",
    header: "Findings",
    cell: (project) => project.findingsCount,
    className: "text-right tabular-nums",
  },
  {
    id: "members",
    header: "Members",
    cell: (project) => project.membersCount,
    className: "hidden text-right tabular-nums sm:table-cell",
  },
  {
    id: "created",
    header: "Created",
    cell: (project) => formatDate(project.createdAt),
    className: "hidden md:table-cell",
  },
];

/** The Organization's Projects, searchable, filterable by Project Status, paginated. */
export function ProjectsList() {
  const { params, hrefWith, update } = useListParams(projectListParamsSchema);
  const { data, error, refetch } = useProjects(params);
  const filtered = params.search !== undefined || params.status !== undefined;

  return (
    <div className="space-y-4">
      <div role="search" className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          label="Search Projects by name"
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="sm:max-w-xs sm:flex-1"
        />
        <FilterSelect
          label="Project Status"
          allLabel="All statuses"
          options={STATUS_OPTIONS}
          value={params.status}
          onChange={(status) => update({ status })}
        />
      </div>

      <Card className="py-0">
        {error ? (
          <ErrorState
            title="Could not load Projects"
            description={error.message}
            onRetry={() => void refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title={
              filtered ? "No Projects match these filters" : "No Projects yet"
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
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption="Projects"
            columns={COLUMNS}
            rows={data?.data}
            getRowId={(project) => project.id}
          />
        )}
      </Card>

      {data && data.meta.totalItems > 0 && (
        <Pagination
          meta={data.meta}
          itemName="Project"
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </div>
  );
}
