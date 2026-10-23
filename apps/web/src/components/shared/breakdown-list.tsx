"use client";

import { motion } from "motion/react";
import { formatNumber, formatPercent } from "@/lib/format";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

type BreakdownItem = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type BreakdownListProps = {
  items: BreakdownItem[];
  className?: string;
};

export function BreakdownList({ items, className }: BreakdownListProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const share = total === 0 ? 0 : item.value / total;
        return (
          <li key={item.id} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>{item.label}</span>
              <span className="tabular-nums">
                <span className="font-medium">{formatNumber(item.value)}</span>
                <span className="ms-2 inline-block w-10 text-end text-muted-foreground">
                  {formatPercent(share)}
                </span>
              </span>
            </div>
            <div aria-hidden className="bg-hatch h-2.5 rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${share * 100}%` }}
                transition={{
                  duration: DURATION.base,
                  ease: EASE_OUT,
                  delay: index * STAGGER,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
