"use client";

import { ChartColumn } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorMessage } from "@/hooks/use-error-message";
import { LOCALE_DIRECTIONS } from "@/i18n/config";
import type { TrendPoint } from "@/lib/api/types";
import { SEVERITIES } from "@/lib/severity";
import { useFindingTrend } from "../hooks/use-dashboard";

/*
 * One series, not a bar stacked by Severity: the five Severity colours are too
 * close for colour-blind readers at segment size. The breakdown per day is in
 * the tooltip and the table, as text.
 */
const chartConfig = {
  total: { color: "var(--chart-1)" },
} satisfies ChartConfig;

/** A trend point's date is a UTC calendar day ("2026-10-22"). */
function utcDay(isoDay: string) {
  return new Date(`${isoDay}T00:00:00Z`);
}

export function FindingTrendChart({ className }: { className?: string }) {
  const { data, error, refetch } = useFindingTrend();
  const t = useTranslations("dashboard.trend");
  const errorMessage = useErrorMessage();

  return (
    <Panel
      title={t("title")}
      description={t("description")}
      className={className}
    >
      {error ? (
        <ErrorState
          title={t("error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <Skeleton aria-busy className="h-60 w-full" />
      ) : data.every((point) => point.total === 0) ? (
        <EmptyState icon={ChartColumn} title={t("empty")} />
      ) : (
        <TrendBars points={data} />
      )}
    </Panel>
  );
}

function TrendBars({ points }: { points: TrendPoint[] }) {
  const t = useTranslations("dashboard.trend");
  const format = useFormatter();
  const formatDay = (isoDay: string) => format.dateTime(utcDay(isoDay), "day");
  // Time runs in the reading direction: right to left in Persian.
  const rtl = LOCALE_DIRECTIONS[useLocale()] === "rtl";
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
        <BarChart data={points} margin={{ top: 4, right: 4, left: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDay}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            reversed={rtl}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={28}
            orientation={rtl ? "right" : "left"}
            tickFormatter={(value: number) => format.number(value)}
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
        {t("summary", {
          total,
          day: formatDay(busiest.date),
          count: busiest.total,
        })}
      </figcaption>
      <TrendTable points={points} />
    </figure>
  );
}

function TrendTooltip({ point }: { point: TrendPoint }) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <p className="font-medium">
        {t("dashboard.trend.tooltip", {
          day: format.dateTime(utcDay(point.date), "day"),
          count: point.total,
        })}
      </p>
      {point.total > 0 && (
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
          {SEVERITIES.filter((severity) => point.bySeverity[severity] > 0).map(
            (severity) => (
              <div key={severity} className="contents">
                <dt className="text-muted-foreground">
                  {t(`severity.${severity}`)}
                </dt>
                <dd className="text-end tabular-nums">
                  {format.number(point.bySeverity[severity])}
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
  const t = useTranslations();
  const format = useFormatter();
  return (
    <table className="sr-only">
      <caption>{t("dashboard.trend.tableCaption")}</caption>
      <thead>
        <tr>
          <th scope="col">{t("dashboard.trend.day")}</th>
          <th scope="col">{t("dashboard.trend.total")}</th>
          {SEVERITIES.map((severity) => (
            <th key={severity} scope="col">
              {t(`severity.${severity}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.date}>
            <th scope="row">{format.dateTime(utcDay(point.date), "day")}</th>
            <td>{format.number(point.total)}</td>
            {SEVERITIES.map((severity) => (
              <td key={severity}>
                {format.number(point.bySeverity[severity])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
