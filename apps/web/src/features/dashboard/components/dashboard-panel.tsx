import { useId, type ReactNode } from "react";
import { Card } from "@/components/ui/card";

type DashboardPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Placement in the Dashboard grid, e.g. a column span. */
  className?: string;
};

/** A titled section of the Dashboard. */
export function DashboardPanel({
  title,
  description,
  children,
  className,
}: DashboardPanelProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={className}>
      <Card className="h-full gap-4 py-5">
        <header className="space-y-1 px-5">
          <h2 id={headingId} className="leading-none font-semibold">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </header>
        <div className="px-5">{children}</div>
      </Card>
    </section>
  );
}
