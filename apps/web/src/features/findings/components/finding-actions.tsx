"use client";

import { Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useErrorMessage } from "@/hooks/use-error-message";
import { Can } from "@/lib/session/session-provider";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { useDeleteFinding } from "../hooks/use-findings";

/** Edit and delete, each offered only to Users with its Permission. */
export function FindingActions({ finding }: { finding: Finding }) {
  const t = useTranslations("findings.actions");
  return (
    <div className="flex gap-2">
      <Can permission="finding:update">
        <Button variant="outline" asChild>
          <Link href={routes.editFinding(finding.id)}>
            <PencilIcon aria-hidden />
            {t("edit")}
          </Link>
        </Button>
      </Can>
      <Can permission="finding:delete">
        <DeleteFindingButton finding={finding} />
      </Can>
    </div>
  );
}

function DeleteFindingButton({ finding }: { finding: Finding }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const deleteFinding = useDeleteFinding(finding.id);
  const t = useTranslations();
  const errorMessage = useErrorMessage();

  function confirmDelete() {
    deleteFinding.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("findings.actions.deleted"));
        router.push(routes.findings());
      },
      onError: (error) =>
        toast.error(
          t("findings.actions.deleteFailed", { reason: errorMessage(error) }),
        ),
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => !deleteFinding.isPending && setOpen(next)}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon aria-hidden />
          {t("findings.actions.delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("findings.actions.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("findings.actions.deleteDescription", { title: finding.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteFinding.isPending}>
            {t("common.cancel")}
          </AlertDialogCancel>
          {/* Not AlertDialogAction: it would close the dialog before the request ends. */}
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={deleteFinding.isPending}
          >
            {deleteFinding.isPending && (
              <Loader2Icon className="animate-spin" aria-hidden />
            )}
            {t("findings.actions.deleteConfirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
