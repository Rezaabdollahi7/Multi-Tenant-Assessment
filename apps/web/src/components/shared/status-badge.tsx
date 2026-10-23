import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/assets/types/common";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<StatusTone, { pill: string; dot: string }> = {
  neutral: { pill: "bg-muted text-foreground", dot: "bg-muted-foreground" },
  active: { pill: "bg-highlight-subtle text-foreground", dot: "bg-foreground" },
  positive: { pill: "bg-success-surface text-success", dot: "bg-success" },
  inactive: {
    pill: "border-border-strong text-muted-foreground",
    dot: "border border-muted-foreground",
  },
};

type StatusBadgeProps = {
  label: string;
  /** Colour of the dot; the label always carries the meaning. */
  tone: StatusTone;
  className?: string;
};

/** The state of something in its life, such as a Project Status. */
export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-transparent px-2.5 py-1 font-normal",
        TONE_CLASSES[tone].pill,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", TONE_CLASSES[tone].dot)}
      />
      {label}
    </Badge>
  );
}
