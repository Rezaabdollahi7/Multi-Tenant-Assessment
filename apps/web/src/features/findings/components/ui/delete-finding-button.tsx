"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Finding } from "@/assets/types/finding";
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
import { errorMessage } from "@/lib/api/api-error";
import { routes } from "@/lib/routes";
import { deleteFinding } from "../../lib/findings-mutations";

export function DeleteFindingButton({ finding }: { finding: Finding }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      try {
        await deleteFinding(finding.id);
        toast.success("یافته حذف شد");
        router.push(routes.findings());
      } catch (error) {
        toast.error(`حذف انجام نشد: ${errorMessage(error)}`);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon aria-hidden />
          حذف
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>این یافته حذف شود؟</AlertDialogTitle>
          <AlertDialogDescription>
            «{finding.title}» برای همهٔ اعضای سازمان شما حذف می‌شود. این کار
            بازگشت‌پذیر نیست.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>انصراف</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            disabled={pending}
          >
            {pending && <Loader2Icon className="animate-spin" aria-hidden />}
            حذف یافته
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
