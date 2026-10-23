import { useFormatter } from "next-intl";
import { cn } from "@/lib/utils";

/** The four looks of a segment; together they tell parts apart without hue. */
export type SegmentTone = "ink" | "highlight" | "hatch" | "outline";

export type Segment = {
  id: string;
  label: string;
  value: number;
  tone: SegmentTone;
};

const TONE_CLASSES: Record<SegmentTone, string> = {
  ink: "bg-ink text-ink-foreground dark:ring-1 dark:ring-border-strong",
  highlight: "bg-highlight text-highlight-foreground",
  hatch: "bg-hatch text-foreground",
  outline: "border border-border-strong text-foreground",
};

type SegmentedBarProps = {
  segments: Segment[];
  /** Spoken after each segment's label, e.g. "2 Projects". */
  describeValue: (value: number) => string;
  className?: string;
};

/**
 * Parts of a whole side by side, each a pill as wide as its share with the
 * share written inside and its label above. Empty parts keep a small pill.
 */
export function SegmentedBar({
  segments,
  describeValue,
  className,
}: SegmentedBarProps) {
  const format = useFormatter();
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <ul className={cn("flex w-full gap-2", className)}>
      {segments.map((segment) => {
        const share = total === 0 ? 0 : segment.value / total;
        return (
          <li
            key={segment.id}
            className="flex min-w-16 flex-col gap-2"
            // Grow with the share; every part stays wide enough to read.
            style={{ flexGrow: Math.max(share, 0.08), flexBasis: 0 }}
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
              {format.number(share, "percent")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
