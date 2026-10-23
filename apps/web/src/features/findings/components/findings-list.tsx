"use client";

import { SearchX } from "lucide-react";
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
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useErrorMessage } from "@/hooks/use-error-message";
import { useListParams } from "@/hooks/use-list-params";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { SEVERITIES } from "@/lib/severity";
import { FINDING_STATUSES } from "@/lib/status";
import { useFindings, useProjectOptions } from "../hooks/use-findings";
import { findingListParamsSchema } from "../schemas";
import { FindingStatusBadge } from "./finding-status-badge";

const LINK_CLASSES =
  "rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** The Organization's Findings, searchable, filterable and paginated. */
export function FindingsList() {
  const { params, hrefWith, update } = useListParams(findingListParamsSchema);
  const { data, error, refetch } = useFindings(params);
  const projectOptions = useProjectOptions();
  const t = useTranslations();
  const format = useFormatter();
  const errorMessage = useErrorMessage();
  const filtered =
    params.search !== undefined ||
    params.severity !== undefined ||
    params.status !== undefined ||
    params.projectId !== undefined;

  const severityOptions = SEVERITIES.map((severity) => ({
    value: severity,
    label: t(`severity.${severity}`),
  }));
  const statusOptions = FINDING_STATUSES.map((status) => ({
    value: status,
    label: t(`findingStatus.${status}`),
  }));
  const columns: DataTableColumn<Finding>[] = [
    {
      id: "title",
      header: t("findings.columns.finding"),
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
      header: t("findings.columns.severity"),
      cell: (finding) => <SeverityBadge severity={finding.severity} />,
    },
    {
      id: "status",
      header: t("findings.columns.status"),
      cell: (finding) => <FindingStatusBadge status={finding.status} />,
      className: "hidden sm:table-cell",
    },
    {
      id: "project",
      header: t("findings.columns.project"),
      cell: (finding) => (
        <Link
          href={routes.project(finding.project.id)}
          className={LINK_CLASSES}
        >
          {finding.project.name}
        </Link>
      ),
      className: "hidden md:table-cell",
    },
    {
      id: "reported",
      header: t("findings.columns.reported"),
      cell: (finding) => format.dateTime(new Date(finding.createdAt), "date"),
      className: "hidden lg:table-cell",
    },
  ];

  return (
    <div className="space-y-4">
      <div role="search" className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          label={t("findings.search")}
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="lg:max-w-xs lg:flex-1"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <FilterSelect
            label={t("findings.severityFilter")}
            allLabel={t("findings.allSeverities")}
            options={severityOptions}
            value={params.severity}
            onChange={(severity) => update({ severity })}
          />
          <FilterSelect
            label={t("findings.statusFilter")}
            allLabel={t("findings.allStatuses")}
            options={statusOptions}
            value={params.status}
            onChange={(status) => update({ status })}
          />
          <FilterSelect
            label={t("findings.projectFilter")}
            allLabel={t("findings.allProjects")}
            options={projectOptions.data ?? []}
            value={params.projectId}
            onChange={(projectId) => update({ projectId })}
          />
        </div>
      </div>

      <Card className="py-0">
        {error ? (
          <ErrorState
            title={t("findings.error")}
            description={errorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : data?.data.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={filtered ? t("findings.emptyFiltered") : t("findings.empty")}
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
                  {t("common.clearFilters")}
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption={t("findings.caption")}
            columns={columns}
            rows={data?.data}
            getRowId={(finding) => finding.id}
          />
        )}
      </Card>

      {data && data.meta.totalItems > 0 && (
        <Pagination
          meta={data.meta}
          totalLabel={t("findings.count", { count: data.meta.totalItems })}
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </div>
  );
}
