"use client";

import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";

/** Server errors reach the browser without their message, so this stays generic. */
export default function FindingError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <Card className="py-0">
      <ErrorState
        title="Could not load this Finding"
        description="The server did not respond as expected. Try again in a moment."
        onRetry={unstable_retry}
      />
    </Card>
  );
}
