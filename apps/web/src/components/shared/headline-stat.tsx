"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useFormatter, useLocale } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";

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
  const locale = useLocale();
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
          // A new language restarts the count in its own digits.
          <CountingFigure key={locale} value={value} />
        )}
      </dd>
    </div>
  );
}

function CountingFigure({ value }: { value: number }) {
  const format = useFormatter();
  if (useReducedMotion()) return format.number(value);
  return <CountUp value={value} format={(current) => format.number(current)} />;
}

function CountUp({
  value,
  format,
}: {
  value: number;
  format: (value: number) => string;
}) {
  const text = useCountUp(value, format);
  return (
    <>
      {/* Assistive technology reads the final figure, not the count. */}
      <span className="sr-only">{format(value)}</span>
      <motion.span aria-hidden>{text}</motion.span>
    </>
  );
}
