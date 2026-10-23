"use client";

import { ArrowUpRight, ChartColumn } from "lucide-react";
import { motion } from "motion/react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Panel } from "@/components/shared/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorMessage } from "@/hooks/use-error-message";
import type { TrendPoint } from "@/lib/api/types";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { routes } from "@/lib/routes";
import { SEVERITIES } from "@/lib/severity";
import { cn } from "@/lib/utils";
import { useFindingTrend } from "../hooks/use-dashboard";

/** Every seventh day is labelled under the bars. */
const LABEL_EVERY_DAYS = 7;

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
      action={
        <Link
          href={routes.findings()}
          aria-label={t("viewFindings")}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors hover:bg-card-solid"
        >
          <ArrowUpRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </Link>
      }
    >
      {error ? (
        <ErrorState
          title={t("error")}
          description={errorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !data ? (
        <Skeleton aria-busy className="h-72 w-full rounded-2xl" />
      ) : data.every((point) => point.total === 0) ? (
        <EmptyState icon={ChartColumn} title={t("empty")} />
      ) : (
        <TrendBars points={data} />
      )}
    </Panel>
  );
}

/**
 * One thin pill per day in the reading direction, so time runs right to left
 * in Persian. One series on purpose: the five Severity colours are too close
 * for colour-blind readers at bar size, so the split per day is in the
 * tooltip and the table, as text.
 */
function TrendBars({ points }: { points: TrendPoint[] }) {
  const t = useTranslations("dashboard.trend");
  const format = useFormatter();
  const formatDay = (isoDay: string) => format.dateTime(utcDay(isoDay), "day");
  const total = points.reduce((sum, point) => sum + point.total, 0);
  const busiest = points.reduce((max, point) =>
    point.total > max.total ? point : max,
  );

  return (
    <figure className="space-y-5">
      <p className="flex items-baseline gap-3">
        <span className="text-hero font-extralight tabular-nums">
          {format.number(total)}
        </span>
        <span className="text-sm text-muted-foreground">
          {t("totalLabel", { count: total })}
        </span>
      </p>

      <div aria-hidden className="flex h-44 items-end gap-1 pt-8 sm:gap-1.5">
        {points.map((point, index) => (
          <DayBar
            key={point.date}
            index={index}
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

/** Seconds between neighbouring bars as they rise, oldest first. */
const BAR_STAGGER = 0.02;

function DayBar({
  index,
  point,
  height,
  busiest,
}: {
  /** Position in the window, for the rising stagger. */
  index: number;
  point: TrendPoint;
  /** Share of the busiest day, 0 to 1. */
  height: number;
  busiest: boolean;
}) {
  const format = useFormatter();
  const rise = {
    duration: DURATION.base,
    ease: EASE_OUT,
    delay: index * BAR_STAGGER,
  };
  return (
    <div className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2">
      <motion.div
        className={cn(
          "relative w-full max-w-2.5 origin-bottom rounded-full transition-colors",
          busiest
            ? "bg-highlight"
            : point.total > 0
              ? "bg-foreground group-hover:bg-highlight"
              : "bg-border-strong",
        )}
        // Empty days keep a stub so the rhythm of the month stays visible.
        style={{ height: `${Math.max(height * 100, 4)}%` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={rise}
      >
        {busiest && (
          // The value lands once its bar has risen.
          <motion.span
            className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-highlight px-2 py-0.5 text-xs font-medium text-highlight-foreground tabular-nums"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: DURATION.quick,
              delay: rise.delay + DURATION.base,
            }}
          >
            {format.number(point.total)}
          </motion.span>
        )}
      </motion.div>
      <span className="size-1 rounded-full bg-foreground/30" />
      {/* Shown only on hover, so it never widens the page. */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 group-hover:block">
        <TrendTooltip point={point} />
      </div>
    </div>
  );
}

function TrendTooltip({ point }: { point: TrendPoint }) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <div className="grid min-w-36 gap-1.5 rounded-2xl bg-ink px-3 py-2 text-xs text-ink-foreground shadow-float">
      <p className="font-medium whitespace-nowrap">
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
                <dt className="text-ink-muted">{t(`severity.${severity}`)}</dt>
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
