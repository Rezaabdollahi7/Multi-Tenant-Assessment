"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Option } from "@/assets/types/common";
import { cn } from "@/lib/utils";

const ALL = "all";

type FilterSelectProps<Value extends string> = {
  label: string;
  allLabel: string;
  options: readonly Option<Value>[];
  value: Value | undefined;
  onChange: (value: Value | undefined) => void;
  className?: string;
};

export function FilterSelect<Value extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
  className,
}: FilterSelectProps<Value>) {
  return (
    <Select
      value={value ?? ALL}
      onValueChange={(selected) =>
        onChange(options.find((option) => option.value === selected)?.value)
      }
    >
      <SelectTrigger
        aria-label={label}
        className={cn("w-full sm:w-44", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
