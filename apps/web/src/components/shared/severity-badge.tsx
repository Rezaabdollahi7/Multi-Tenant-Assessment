import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { FindingSeverity } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Text on a tinted surface per level; contrast is AA in both themes (docs/design-system.md). */
const SEVERITY_BADGE_CLASSES: Record<FindingSeverity, string> = {
  CRITICAL:
    "border-severity-critical/30 bg-severity-critical-surface text-severity-critical-foreground",
  HIGH: "border-severity-high/30 bg-severity-high-surface text-severity-high-foreground",
  MEDIUM:
    "border-severity-medium/30 bg-severity-medium-surface text-severity-medium-foreground",
  LOW: "border-severity-low/30 bg-severity-low-surface text-severity-low-foreground",
  INFO: "border-severity-info/30 bg-severity-info-surface text-severity-info-foreground",
};

type SeverityBadgeProps = {
  severity: FindingSeverity;
  className?: string;
};

/** A Finding's Severity, always as text; the colour only reinforces it. */
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const t = useTranslations("severity");
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-1 font-normal",
        SEVERITY_BADGE_CLASSES[severity],
        className,
      )}
    >
      {t(severity)}
    </Badge>
  );
}
