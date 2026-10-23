"use client";

import { SearchX } from "lucide-react";
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
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import type { Finding } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
import { useFindings, useProjectOptions } from "../hooks/use-findings";
import { findingListParamsSchema } from "../schemas";
import { FindingStatusBadge } from "./finding-status-badge";

const SEVERITY_OPTIONS = SEVERITIES.map((severity) => ({
  value: severity,
  label: SEVERITY_LABELS[severity],
}));

const STATUS_OPTIONS = FINDING_STATUSES.map((status) => ({
  value: status,
  label: FINDING_STATUS_LABELS[status],
}));

const LINK_CLASSES =
  "rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

const COLUMNS: DataTableColumn<Finding>[] = [
  {
    id: "title",
    header: "Finding",
    cell: (finding) => (
      <Link
        href={routes.finding(finding.id)}
        className={`font-medium text-primary ${LINK_CLASSES}`}
      >
        {finding.title}
      </Link>
    ),
    className: "max-w-80 whitespace-normal",
  },
  {
    id: "severity",
    header: "Severity",
    cell: (finding) => <SeverityBadge severity={finding.severity} />,
  },
  {
    id: "status",
    header: "Finding Status",
    cell: (finding) => <FindingStatusBadge status={finding.status} />,
    className: "hidden sm:table-cell",
  },
  {
    id: "project",
    header: "Project",
    cell: (finding) => (
      <Link href={routes.project(finding.project.id)} className={LINK_CLASSES}>
        {finding.project.name}
      </Link>
    ),
    className: "hidden md:table-cell",
  },
  {
    id: "reported",
    header: "Reported",
    cell: (finding) => formatDate(finding.createdAt),
    className: "hidden lg:table-cell",
  },
];

/** The Organization's Findings, searchable, filterable and paginated. */
export function FindingsList() {
  const { params, hrefWith, update } = useListParams(findingListParamsSchema);
  const { data, error, refetch } = useFindings(params);
  const projectOptions = useProjectOptions();
  const filtered =
    params.search !== undefined ||
    params.severity !== undefined ||
    params.status !== undefined ||
    params.projectId !== undefined;

  return (
    <div className="space-y-4">
      <div role="search" className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          label="Search Findings by title"
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="lg:max-w-xs lg:flex-1"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <FilterSelect
            label="Severity"
            allLabel="All Severities"
            options={SEVERITY_OPTIONS}
            value={params.severity}
            onChange={(severity) => update({ severity })}
          />
          <FilterSelect
            label="Finding Status"
            allLabel="All statuses"
            options={STATUS_OPTIONS}
            value={params.status}
            onChange={(status) => update({ status })}
          />
          <FilterSelect
            label="Project"
            allLabel="All Projects"
            options={projectOptions.data ?? []}
            value={params.projectId}
            onChange={(projectId) => update({ projectId })}
          />
        </div>
      </div>

      <Card className="py-0">
        {error ? (
          <ErrorState
            title="Could not load Findings"
            description={error.message}
            onRetry={() => void refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={
              filtered ? "No Findings match these filters" : "No Findings yet"
            }
            action={
              filtered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    update({
                      search: undefined,
                      severity: undefined,
                      status: undefined,
                      projectId: undefined,
                    })
                  }
                >
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption="Findings"
            columns={COLUMNS}
            rows={data?.data}
            getRowId={(finding) => finding.id}
          />
        )}
      </Card>

      {data && data.meta.totalItems > 0 && (
        <Pagination
          meta={data.meta}
          itemName="Finding"
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </div>
  );
}
