import type { TrendPoint } from "@/assets/types/dashboard";
import { formatDay, formatNumber } from "@/lib/format";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";

export function TrendTooltip({ point }: { point: TrendPoint }) {
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
