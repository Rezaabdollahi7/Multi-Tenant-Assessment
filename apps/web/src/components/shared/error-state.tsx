"use client";

import { CircleAlert, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  titleAs?: "p" | "h1";
  className?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  titleAs: Title = "p",
  className,
}: ErrorStateProps) {
  const router = useRouter();
  const [retrying, startRetry] = useTransition();

  function retry() {
    if (onRetry) onRetry();
    else startRetry(() => router.refresh());
  }

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
      <Button variant="outline" size="sm" onClick={retry} disabled={retrying}>
        {retrying && <Loader2Icon className="animate-spin" aria-hidden />}
        تلاش دوباره
      </Button>
    </div>
  );
}
