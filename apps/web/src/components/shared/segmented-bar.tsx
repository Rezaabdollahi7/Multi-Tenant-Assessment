"use client";

import { motion } from "motion/react";
import { formatPercent } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SegmentTone = "ink" | "highlight" | "hatch" | "outline";

export type Segment = {
  id: string;
  label: string;
  value: number;
  tone: SegmentTone;
};

const MIN_GROW = 0.08;

const TONE_CLASSES: Record<SegmentTone, string> = {
  ink: "bg-ink text-ink-foreground dark:ring-1 dark:ring-border-strong",
  highlight: "bg-highlight text-highlight-foreground",
  hatch: "bg-hatch text-foreground",
  outline: "border border-border-strong text-foreground",
};

type SegmentedBarProps = {
  segments: Segment[];
  describeValue: (value: number) => string;
  className?: string;
};

export function SegmentedBar({
  segments,
  describeValue,
  className,
}: SegmentedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <ul className={cn("flex w-full gap-2", className)}>
      {segments.map((segment) => {
        const share = total === 0 ? 0 : segment.value / total;
        return (
          <motion.li
            key={segment.id}
            className="flex min-w-16 flex-col gap-2"
            style={{ flexBasis: 0 }}
            initial={{ flexGrow: MIN_GROW }}
            animate={{ flexGrow: Math.max(share, MIN_GROW) }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <span className="truncate text-sm text-muted-foreground">
              {segment.label}
              <span className="sr-only">: {describeValue(segment.value)}</span>
            </span>
            <span
              className={cn(
                "flex h-10 items-center rounded-full px-4 text-xs tabular-nums",
                TONE_CLASSES[segment.tone],
              )}
            >
              {formatPercent(share)}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
