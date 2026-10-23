import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Detail = { label: string; value: ReactNode };

export function DetailList({
  details,
  className,
}: {
  details: Detail[];
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-3 text-sm", className)}>
      {details.map(({ label, value }) => (
        <div key={label} className="flex items-baseline gap-2">
          <dt className="shrink-0 text-muted-foreground">{label}</dt>
          <span
            aria-hidden
            className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-border-strong"
          />
          <dd className="max-w-[65%] truncate text-end">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
