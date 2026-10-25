"use client";

import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/status";
import type { ProjectListParams } from "../../lib/schemas";

const STATUS_OPTIONS = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABELS[status],
}));

type ProjectsFiltersProps = {
  params: ProjectListParams;
  onUpdate: (patch: Partial<ProjectListParams>) => void;
};

export function ProjectsFilters({ params, onUpdate }: ProjectsFiltersProps) {
  return (
    <div role="search" className="flex flex-col gap-3 sm:flex-row">
      <SearchInput
        label="جست‌وجوی پروژه با نام"
        value={params.search ?? ""}
        onSearch={(search) => onUpdate({ search })}
        className="sm:max-w-xs sm:flex-1"
      />
      <FilterSelect
        label="وضعیت پروژه"
        allLabel="همهٔ وضعیت‌ها"
        options={STATUS_OPTIONS}
        value={params.status}
        onChange={(status) => onUpdate({ status })}
      />
    </div>
  );
}
