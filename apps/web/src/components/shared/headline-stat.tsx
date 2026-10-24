"use client";

import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber } from "@/lib/format";

type HeadlineStatProps = {
  label: string;
  value?: number;
  icon: LucideIcon;
};

export function HeadlineStat({ label, value, icon: Icon }: HeadlineStatProps) {
  return (
    <div className="flex flex-col gap-1" aria-busy={value === undefined}>
      <dt className="order-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="flex size-6 items-center justify-center rounded-full border border-border-strong">
          <Icon aria-hidden className="size-3.5" />
        </span>
        {label}
      </dt>
      <dd className="order-1 text-hero font-extralight tabular-nums">
        {value === undefined ? (
          <Skeleton className="h-14 w-20 rounded-2xl" />
        ) : (
          <CountUp value={value} />
        )}
      </dd>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const text = useCountUp(value, formatNumber);
  return (
    <>
      <span className="sr-only">{formatNumber(value)}</span>
      <span aria-hidden>{text}</span>
    </>
  );
}
