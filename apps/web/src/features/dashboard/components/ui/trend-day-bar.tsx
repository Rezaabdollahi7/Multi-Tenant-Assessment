import type { TrendPoint } from "@/assets/types/dashboard";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TrendTooltip } from "./trend-tooltip";

type DayBarProps = {
  point: TrendPoint;
  height: number;
  busiest: boolean;
};

export function DayBar({ point, height, busiest }: DayBarProps) {
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
