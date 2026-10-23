import { useId, type ReactNode } from "react";
import { Card } from "@/components/ui/card";

type PanelProps = {
  title: string;
  description?: string;
  /** A link or button beside the title, e.g. "View all". */
  action?: ReactNode;
  children: ReactNode;
  /** Placement in the page grid, e.g. a column span. */
  className?: string;
};

/** A titled section of a page, in a card. */
export function Panel({
  title,
  description,
  action,
  children,
  className,
}: PanelProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={className}>
      <Card className="h-full gap-4 py-5">
        <header className="flex items-start justify-between gap-3 px-5">
          <div className="space-y-1">
            <h2 id={headingId} className="leading-none font-semibold">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </header>
        <div className="px-5">{children}</div>
      </Card>
    </section>
  );
}
