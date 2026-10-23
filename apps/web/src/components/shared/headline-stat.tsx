"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber } from "@/lib/format";

type HeadlineStatProps = {
  label: string;
  /** Omitted while loading; a skeleton takes its place. */
  value?: number;
  icon: LucideIcon;
};

/**
 * One large, light figure with a small icon and label under it; the figure
 * counts up when it arrives. Renders a label-value pair, so place it inside
 * a <dl>.
 */
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
      {/* Assistive technology reads the final figure, not the count. */}
      <span className="sr-only">{formatNumber(value)}</span>
      <motion.span aria-hidden>{text}</motion.span>
    </>
  );
}
