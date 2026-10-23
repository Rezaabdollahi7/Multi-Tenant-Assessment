import { useId, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PanelProps = {
  title: string;
  description?: string;
  /** A link or button beside the title, e.g. "View all". */
  action?: ReactNode;
  /** `ink` is the dark feature card; one per page at most. */
  variant?: "glass" | "ink";
  children: ReactNode;
  /** Placement in the page grid, e.g. a column span. */
  className?: string;
};

/** A titled section of a page, in a card. */
export function Panel({
  title,
  description,
  action,
  variant = "glass",
  children,
  className,
}: PanelProps) {
  const headingId = useId();
  const body = (
    <>
      <header className="flex items-start justify-between gap-3 px-6">
        <div className="space-y-1">
          <h2 id={headingId} className="text-xl leading-tight font-normal">
            {title}
          </h2>
          {description && (
            <p
              className={cn(
                "text-sm",
                variant === "ink" ? "text-ink-muted" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <div className="px-6">{children}</div>
    </>
  );

  return (
    <section aria-labelledby={headingId} className={className}>
      {variant === "ink" ? (
        <div className="flex h-full flex-col gap-5 rounded-2xl bg-ink py-6 text-ink-foreground shadow-float">
          {body}
        </div>
      ) : (
        <Card className="h-full gap-5">{body}</Card>
      )}
    </section>
  );
}
