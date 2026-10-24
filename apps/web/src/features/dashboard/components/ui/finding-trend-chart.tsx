"use client";

import type { TrendPoint } from "@/assets/types/dashboard";
import { formatDay, formatNumber } from "@/lib/format";
import { DayBar } from "./trend-day-bar";
import { TrendTable } from "./trend-table";

const LABEL_EVERY_DAYS = 7;

export function FindingTrendChart({ points }: { points: TrendPoint[] }) {
  const total = points.reduce((sum, point) => sum + point.total, 0);
  const busiest = points.reduce((max, point) =>
    point.total > max.total ? point : max,
  );

  return (
    <figure className="space-y-5">
      <p className="flex items-baseline gap-3">
        <span className="text-hero font-extralight tabular-nums">
          {formatNumber(total)}
        </span>
        <span className="text-sm text-muted-foreground">
          یافته در ۳۰ روز گذشته
        </span>
      </p>

      <div aria-hidden className="flex h-44 items-end gap-1 pt-8 sm:gap-1.5">
        {points.map((point) => (
          <DayBar
            key={point.date}
            point={point}
            height={point.total / busiest.total}
            busiest={point === busiest}
          />
        ))}
      </div>
      <div aria-hidden className="flex gap-1 sm:gap-1.5">
        {points.map((point, index) => (
          <span
            key={point.date}
            className="flex-1 text-center text-[11px] whitespace-nowrap text-muted-foreground"
          >
            {index % LABEL_EVERY_DAYS === 0 ? formatDay(point.date) : ""}
          </span>
        ))}
      </div>

      <figcaption className="text-sm text-muted-foreground">
        {formatNumber(total)} یافته ثبت شد؛ پرکارترین روز{" "}
        {formatDay(busiest.date)} با {formatNumber(busiest.total)} یافته بود.
      </figcaption>
      <TrendTable points={points} />
    </figure>
  );
}
