import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  /** Short statement of what failed, e.g. "Could not load Findings". */
  title: string;
  /** Detail shown under the title, usually the API's message. */
  description?: string;
  /** Offers a "Try again" button when given. */
  onRetry?: () => void;
  className?: string;
};

/** Replaces content that failed to load; announced to screen readers. */
export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-10 text-center",
        className,
      )}
    >
      <CircleAlert aria-hidden className="size-6 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
