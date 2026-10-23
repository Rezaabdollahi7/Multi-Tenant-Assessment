import { cn } from "@/lib/utils";

export type BreakdownItem = {
  id: string;
  label: string;
  value: number;
  /** CSS colour of the bar; the label always carries the meaning too. */
  color: string;
};

type BreakdownListProps = {
  items: BreakdownItem[];
  className?: string;
};

const percentFormat = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 0,
});

/** Each part of a whole as a labelled row with its count, share and a bar. */
export function BreakdownList({ items, className }: BreakdownListProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => {
        const share = total === 0 ? 0 : item.value / total;
        return (
          <li key={item.id} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>{item.label}</span>
              <span className="tabular-nums">
                <span className="font-medium">{item.value}</span>
                <span className="ml-2 inline-block w-10 text-right text-muted-foreground">
                  {percentFormat.format(share)}
                </span>
              </span>
            </div>
            <div aria-hidden className="h-2 rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${share * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
