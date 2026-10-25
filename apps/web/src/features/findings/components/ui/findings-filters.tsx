"use client";

import type { Option } from "@/assets/types/common";
import { FilterSelect } from "@/components/shared/filter-select";
import { SearchInput } from "@/components/shared/search-input";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
import type { FindingListParams } from "../../lib/schemas";

const SEVERITY_OPTIONS = SEVERITIES.map((severity) => ({
  value: severity,
  label: SEVERITY_LABELS[severity],
}));

const STATUS_OPTIONS = FINDING_STATUSES.map((status) => ({
  value: status,
  label: FINDING_STATUS_LABELS[status],
}));

type FindingsFiltersProps = {
  params: FindingListParams;
  projectOptions: Option[];
  onUpdate: (patch: Partial<FindingListParams>) => void;
};

export function FindingsFilters({
  params,
  projectOptions,
  onUpdate,
}: FindingsFiltersProps) {
  return (
    <div role="search" className="flex flex-col gap-3 lg:flex-row">
      <SearchInput
        label="جست‌وجوی یافته با عنوان"
        value={params.search ?? ""}
        onSearch={(search) => onUpdate({ search })}
        className="lg:max-w-xs lg:flex-1"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
        <FilterSelect
          label="شدت"
          allLabel="همهٔ شدت‌ها"
          options={SEVERITY_OPTIONS}
          value={params.severity}
          onChange={(severity) => onUpdate({ severity })}
        />
        <FilterSelect
          label="وضعیت یافته"
          allLabel="همهٔ وضعیت‌ها"
          options={STATUS_OPTIONS}
          value={params.status}
          onChange={(status) => onUpdate({ status })}
        />
        <FilterSelect
          label="پروژه"
          allLabel="همهٔ پروژه‌ها"
          options={projectOptions}
          value={params.projectId}
          onChange={(projectId) => onUpdate({ projectId })}
        />
      </div>
    </div>
  );
}
