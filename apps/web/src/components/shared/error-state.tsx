import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  /** Short statement of what failed, e.g. "Could not load Findings". */
  title: string;
  /** Detail shown under the title, usually the API's message. */
  description?: string;
  /** Offers a "Try again" button when given. */
  onRetry?: () => void;
  /** The title's element: `h1` when the state stands in for the whole page. */
  titleAs?: "p" | "h1";
  className?: string;
};

/** Replaces content that failed to load; announced to screen readers. */
export function ErrorState({
  title,
  description,
  onRetry,
  titleAs: Title = "p",
  className,
}: ErrorStateProps) {
  const t = useTranslations("common");
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-10 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <CircleAlert aria-hidden className="size-5 text-destructive" />
      </span>
      <div className="space-y-1">
        <Title className="text-base font-medium">{title}</Title>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("tryAgain")}
        </Button>
      )}
    </div>
  );
}
