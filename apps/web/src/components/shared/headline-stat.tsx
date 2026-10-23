import type { LucideIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

type HeadlineStatProps = {
  label: string;
  /** Omitted while loading; a skeleton takes its place. */
  value?: number;
  icon: LucideIcon;
};

/**
 * One large, light figure with a small icon and label under it. Renders a
 * label-value pair, so place it inside a <dl>.
 */
export function HeadlineStat({ label, value, icon: Icon }: HeadlineStatProps) {
  const format = useFormatter();
  return (
    <div className="flex flex-col gap-1" aria-busy={value === undefined}>
      <dt className="order-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="flex size-6 items-center justify-center rounded-full border border-border-strong">
          <Icon aria-hidden className="size-3.5" />
        </span>
        {label}
      </dt>
      <dd className="order-1 text-hero font-extralight tabular-nums">
        {value === undefined ? (
          <Skeleton className="h-14 w-20 rounded-2xl" />
        ) : (
          format.number(value)
        )}
      </dd>
    </div>
  );
}
