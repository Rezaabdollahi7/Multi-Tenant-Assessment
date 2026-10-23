import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/shared/status-badge";
import type { FindingStatus } from "@/lib/api/types";
import { FINDING_STATUS_TONES } from "@/lib/status";

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  const t = useTranslations("findingStatus");
  return <StatusBadge label={t(status)} tone={FINDING_STATUS_TONES[status]} />;
}
