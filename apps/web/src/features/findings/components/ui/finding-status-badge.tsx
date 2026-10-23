import type { FindingStatus } from "@/assets/types/finding";
import { StatusBadge } from "@/components/shared/status-badge";
import { FINDING_STATUS_LABELS, FINDING_STATUS_TONES } from "@/lib/status";

export function FindingStatusBadge({ status }: { status: FindingStatus }) {
  return (
    <StatusBadge
      label={FINDING_STATUS_LABELS[status]}
      tone={FINDING_STATUS_TONES[status]}
    />
  );
}
