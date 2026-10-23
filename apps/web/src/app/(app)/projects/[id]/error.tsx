"use client";

import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";

export default function ProjectError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <Card className="py-0">
      <ErrorState
        title="این پروژه بارگذاری نشد"
        titleAs="h1"
        description="پاسخ سرور مطابق انتظار نبود. کمی بعد دوباره تلاش کنید."
        onRetry={unstable_retry}
      />
    </Card>
  );
}
