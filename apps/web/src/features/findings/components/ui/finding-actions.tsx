"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";
import type { Finding } from "@/assets/types/finding";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { useCan } from "@/lib/session/session-provider";
import { DeleteFindingButton } from "./delete-finding-button";

export function FindingActions({ finding }: { finding: Finding }) {
  const canEdit = useCan("finding", "update");
  const canDelete = useCan("finding", "delete");
  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex gap-2">
      {canEdit && (
        <Button variant="outline" asChild>
          <Link href={routes.editFinding(finding.id)}>
            <PencilIcon aria-hidden />
            ویرایش
          </Link>
        </Button>
      )}
      {canDelete && <DeleteFindingButton finding={finding} />}
    </div>
  );
}
