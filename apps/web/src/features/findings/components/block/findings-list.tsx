"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import type { Option } from "@/assets/types/common";
import type { Finding, FindingList } from "@/assets/types/finding";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
import { cn } from "@/lib/utils";
import { findingListParamsSchema } from "../../lib/schemas";
import { FindingStatusBadge } from "../ui/finding-status-badge";

const LINK_CLASSES = "rounded-sm underline-offset-4 hover:underline";

const SEVERITY_OPTIONS = SEVERITIES.map((severity) => ({
  value: severity,
  label: SEVERITY_LABELS[severity],
}));

const STATUS_OPTIONS = FINDING_STATUSES.map((status) => ({
  value: status,
  label: FINDING_STATUS_LABELS[status],
}));

const COLUMNS: DataTableColumn<Finding>[] = [
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

type FindingsListProps = {
  findings: FindingList;
  projectOptions: Option[];
};

export function FindingsList({ findings, projectOptions }: FindingsListProps) {
  const { params, hrefWith, update, pending } = useListParams(
    findingListParamsSchema,
  );
  const filtered =
    params.search !== undefined ||
    params.severity !== undefined ||
    params.status !== undefined ||
    params.projectId !== undefined;

  return (
    <Card className="gap-4 rounded-3xl p-4 sm:p-6">
      <div role="search" className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          label="جست‌وجوی یافته با عنوان"
          value={params.search ?? ""}
          onSearch={(search) => update({ search })}
          className="lg:max-w-xs lg:flex-1"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <FilterSelect
            label="شدت"
            allLabel="همهٔ شدت‌ها"
            options={SEVERITY_OPTIONS}
            value={params.severity}
            onChange={(severity) => update({ severity })}
          />
          <FilterSelect
            label="وضعیت یافته"
            allLabel="همهٔ وضعیت‌ها"
            options={STATUS_OPTIONS}
            value={params.status}
            onChange={(status) => update({ status })}
          />
          <FilterSelect
            label="پروژه"
            allLabel="همهٔ پروژه‌ها"
            options={projectOptions}
            value={params.projectId}
            onChange={(projectId) => update({ projectId })}
          />
        </div>
      </div>

      <div
        aria-busy={pending}
        className={cn("transition-opacity", pending && "opacity-60")}
      >
        {findings.data.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={
              filtered
                ? "هیچ یافته‌ای با این فیلترها پیدا نشد"
                : "هنوز یافته‌ای وجود ندارد"
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
                  پاک کردن فیلترها
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            caption="یافته‌ها"
            columns={COLUMNS}
            rows={findings.data}
            getRowId={(finding) => finding.id}
          />
        )}
      </div>

      {findings.meta.totalItems > 0 && (
        <Pagination
          meta={findings.meta}
          totalLabel={`${formatNumber(findings.meta.totalItems)} یافته`}
          hrefForPage={(page) => hrefWith({ page })}
        />
      )}
    </Card>
  );
}
