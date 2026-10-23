"use client";

import { Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";
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
import { Can } from "@/lib/session/session-provider";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { useDeleteFinding } from "../hooks/use-findings";

/** Edit and delete, each offered only to Users with its Permission. */
export function FindingActions({ finding }: { finding: Finding }) {
  return (
    <div className="flex gap-2">
      <Can permission="finding:update">
        <Button variant="outline" size="sm" asChild>
          <Link href={routes.editFinding(finding.id)}>
            <PencilIcon aria-hidden />
            Edit
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

  function confirmDelete() {
    deleteFinding.mutate(undefined, {
      onSuccess: () => {
        toast.success("Finding deleted");
        router.push(routes.findings());
      },
      onError: (error) => toast.error(`Could not delete: ${error.message}`),
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => !deleteFinding.isPending && setOpen(next)}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon aria-hidden />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this Finding?</AlertDialogTitle>
          <AlertDialogDescription>
            “{finding.title}” will be removed for everyone in your Organization.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteFinding.isPending}>
            Cancel
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
            Delete Finding
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
