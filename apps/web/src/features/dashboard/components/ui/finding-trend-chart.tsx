"use client";

import type { TrendPoint } from "@/assets/types/dashboard";
import { formatDay, formatNumber } from "@/lib/format";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { cn } from "@/lib/utils";

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

function DayBar({
  point,
  height,
  busiest,
}: {
  point: TrendPoint;
  height: number;
  busiest: boolean;
}) {
  return (
    <div className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2">
      <div
        className={cn(
          "relative w-full max-w-2.5 origin-bottom rounded-full transition-colors",
          busiest
            ? "bg-highlight"
            : point.total > 0
              ? "bg-foreground group-hover:bg-highlight"
              : "bg-border-strong",
        )}
        style={{ height: `${Math.max(height * 100, 4)}%` }}
      >
        {busiest && (
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-highlight px-2 py-0.5 text-xs font-medium text-highlight-foreground tabular-nums">
            {formatNumber(point.total)}
          </span>
        )}
      </div>
      <span className="size-1 rounded-full bg-foreground/30" />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
        <TrendTooltip point={point} />
      </div>
    </div>
  );
}

function TrendTooltip({ point }: { point: TrendPoint }) {
  return (
    <div className="grid min-w-36 gap-1.5 rounded-2xl bg-ink px-3 py-2 text-xs text-ink-foreground shadow-float">
      <p className="font-medium whitespace-nowrap">
        {formatDay(point.date)}: {formatNumber(point.total)} یافته
      </p>
      {point.total > 0 && (
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
          {SEVERITIES.filter((severity) => point.bySeverity[severity] > 0).map(
            (severity) => (
              <div key={severity} className="contents">
                <dt className="text-ink-muted">{SEVERITY_LABELS[severity]}</dt>
                <dd className="text-end tabular-nums">
                  {formatNumber(point.bySeverity[severity])}
                </dd>
              </div>
            ),
          )}
        </dl>
      )}
    </div>
  );
}

function TrendTable({ points }: { points: TrendPoint[] }) {
  return (
    <table className="sr-only">
      <caption>یافته‌های ثبت‌شده در هر روز</caption>
      <thead>
        <tr>
          <th scope="col">روز</th>
          <th scope="col">مجموع</th>
          {SEVERITIES.map((severity) => (
            <th key={severity} scope="col">
              {SEVERITY_LABELS[severity]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.date}>
            <th scope="row">{formatDay(point.date)}</th>
            <td>{formatNumber(point.total)}</td>
            {SEVERITIES.map((severity) => (
              <td key={severity}>{formatNumber(point.bySeverity[severity])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
