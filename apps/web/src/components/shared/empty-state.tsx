import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Decorative icon above the title. */
  icon?: LucideIcon;
  /** A next step, such as a link to create the first item. */
  action?: ReactNode;
  /** The title's element: `h1` when the state stands in for the whole page. */
  titleAs?: "p" | "h1";
  className?: string;
};

/** Shown in place of a list or chart that has nothing to show yet. */
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  titleAs: Title = "p",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-10 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon aria-hidden className="size-5 text-muted-foreground" />
        </span>
      )}
      <div className="space-y-1">
        <Title className="text-base font-medium">{title}</Title>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
