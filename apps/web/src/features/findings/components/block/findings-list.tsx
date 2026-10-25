"use client";

import type { Option } from "@/assets/types/common";
import type { FindingList } from "@/assets/types/finding";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";
import { findingListParamsSchema } from "../../lib/schemas";
import { FINDINGS_COLUMNS } from "../ui/findings-columns";
import { FindingsFilters } from "../ui/findings-filters";

export function FindingsList({
  findings,
  projectOptions,
}: {
  findings: FindingList;
  projectOptions: Option[];
}) {
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
      <FindingsFilters
        params={params}
        projectOptions={projectOptions}
        onUpdate={update}
      />

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
            columns={FINDINGS_COLUMNS}
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
