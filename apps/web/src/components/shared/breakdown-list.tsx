"use client";

import { motion } from "motion/react";
import { useFormatter } from "next-intl";
import { DURATION, EASE_OUT, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type BreakdownItem = {
  id: string;
  label: string;
  value: number;
  /** CSS colour of the bar; the label always carries the meaning too. */
  color: string;
};

type BreakdownListProps = {
  items: BreakdownItem[];
  className?: string;
};

/** Each part of a whole as a labelled row with its count, share and a bar on a hatched track. */
export function BreakdownList({ items, className }: BreakdownListProps) {
  const format = useFormatter();
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
                <span className="font-medium">{format.number(item.value)}</span>
                <span className="ms-2 inline-block w-10 text-end text-muted-foreground">
                  {format.number(share, "percent")}
                </span>
              </span>
            </div>
            <div aria-hidden className="bg-hatch h-2.5 rounded-full">
              {/* Grows to its share, and moves when the data changes. */}
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
