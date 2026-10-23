"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Radix Select cannot use "" as an item value, so "no filter" needs a name. */
const ALL = "all";

type FilterSelectProps<Value extends string> = {
  /** Accessible name, e.g. "Project Status". */
  label: string;
  /** Text of the "no filter" option, e.g. "All statuses". */
  allLabel: string;
  options: readonly { value: Value; label: string }[];
  /** The applied filter; undefined means no filter. */
  value: Value | undefined;
  onChange: (value: Value | undefined) => void;
  className?: string;
};

/** A single-choice filter with an "all" option. */
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
