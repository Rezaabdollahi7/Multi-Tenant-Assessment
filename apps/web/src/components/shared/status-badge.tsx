import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

const DOT_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground",
  active: "bg-primary",
  positive: "bg-chart-4",
  inactive: "border border-muted-foreground",
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
        "gap-1.5 font-normal",
        tone === "inactive" && "text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", DOT_CLASSES[tone])}
      />
      {label}
    </Badge>
  );
}
