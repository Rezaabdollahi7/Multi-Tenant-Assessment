"use client";

import { FolderSearch } from "lucide-react";
import type { ProjectList } from "@/assets/types/project";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListParams } from "@/hooks/use-list-params";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { projectListParamsSchema } from "../../lib/schemas";
import { PROJECTS_COLUMNS } from "../ui/projects-columns";
import { ProjectsFilters } from "../ui/projects-filters";

export function ProjectsList({ projects }: { projects: ProjectList }) {
  const { params, hrefWith, update, pending } = useListParams(
    projectListParamsSchema,
  );
  const filtered = params.search !== undefined || params.status !== undefined;

  return (
    <Card className="gap-4 rounded-3xl p-4 sm:p-6">
      <ProjectsFilters params={params} onUpdate={update} />

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
            columns={PROJECTS_COLUMNS}
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
