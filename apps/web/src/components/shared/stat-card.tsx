import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardProps = {
  label: string;
  /** Omitted while loading; a skeleton takes its place. */
  value?: number;
  /** One line of context under the value, e.g. "3 in progress". */
  hint?: string;
  icon: LucideIcon;
};

const numberFormat = new Intl.NumberFormat("en");

/** A single headline number with its label. */
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  const loading = value === undefined;
  return (
    <Card className="gap-0 px-5 py-4" aria-busy={loading}>
      <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <Icon
          aria-hidden
          className="row-span-2 size-4 self-start text-muted-foreground"
        />
        <dd className="text-2xl font-semibold tabular-nums">
          {loading ? (
            <Skeleton className="my-1 h-6 w-16" />
          ) : (
            numberFormat.format(value)
          )}
        </dd>
        {hint && !loading && (
          <dd className="col-span-2 text-xs text-muted-foreground">{hint}</dd>
        )}
      </dl>
    </Card>
  );
}
