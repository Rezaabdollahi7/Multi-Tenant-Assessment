"use client";

import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";

/** Server errors reach the browser without their message, so this stays generic. */
export default function FindingError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("findings.details");
  return (
    <Card className="py-0">
      <ErrorState
        title={t("error")}
        description={t("errorDescription")}
        onRetry={unstable_retry}
      />
    </Card>
  );
}
