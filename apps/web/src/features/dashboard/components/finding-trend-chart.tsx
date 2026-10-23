"use client";

import { ChartColumn } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { TrendPoint } from "@/lib/api/types";
import { formatCount, formatDay } from "@/lib/format";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { useFindingTrend } from "../hooks/use-dashboard";
import { DashboardPanel } from "./dashboard-panel";

/*
 * One series, not a bar stacked by Severity: the five Severity colours are too
 * close for colour-blind readers at segment size. The breakdown per day is in
 * the tooltip and the table, as text.
 */
const chartConfig = {
  total: { label: "Findings", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function FindingTrendChart({ className }: { className?: string }) {
  const { data, error, refetch } = useFindingTrend();

  return (
    <DashboardPanel
      title="Finding trend"
      description="Findings reported per day, last 30 days"
      className={className}
    >
      {error ? (
        <ErrorState
          title="Could not load the Finding trend"
          description={error.message}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <Skeleton aria-busy className="h-60 w-full" />
      ) : data.every((point) => point.total === 0) ? (
        <EmptyState
          icon={ChartColumn}
          title="No Findings in the last 30 days"
        />
      ) : (
        <TrendBars points={data} />
      )}
    </DashboardPanel>
  );
}

function TrendBars({ points }: { points: TrendPoint[] }) {
  const total = points.reduce((sum, point) => sum + point.total, 0);
  const busiest = points.reduce((max, point) =>
    point.total > max.total ? point : max,
  );

  return (
    <figure>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-60 w-full"
        aria-hidden
      >
        <BarChart data={points} margin={{ top: 4, right: 4, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={({ active, label }) => {
              const point = points.find(
                (candidate) => candidate.date === label,
              );
              return active && point ? <TrendTooltip point={point} /> : null;
            }}
          />
          {/* No entry animation: the design system keeps motion to hover and focus. */}
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
      <figcaption className="mt-2 text-sm text-muted-foreground">
        {formatCount(total, "Finding")} reported; the busiest day was{" "}
        {formatDay(busiest.date)} with {busiest.total}.
      </figcaption>
      <TrendTable points={points} />
    </figure>
  );
}

function TrendTooltip({ point }: { point: TrendPoint }) {
  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">
        {formatDay(point.date)}: {formatCount(point.total, "Finding")}
      </p>
      {point.total > 0 && (
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
          {SEVERITIES.filter((severity) => point.bySeverity[severity] > 0).map(
            (severity) => (
              <div key={severity} className="contents">
                <dt className="text-muted-foreground">
                  {SEVERITY_LABELS[severity]}
                </dt>
                <dd className="text-right font-mono tabular-nums">
                  {point.bySeverity[severity]}
                </dd>
              </div>
            ),
          )}
        </dl>
      )}
    </div>
  );
}

/** The chart's data for screen readers, which cannot read the bars. */
function TrendTable({ points }: { points: TrendPoint[] }) {
  return (
    <table className="sr-only">
      <caption>Findings reported per day</caption>
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Total</th>
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
            <td>{point.total}</td>
            {SEVERITIES.map((severity) => (
              <td key={severity}>{point.bySeverity[severity]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
