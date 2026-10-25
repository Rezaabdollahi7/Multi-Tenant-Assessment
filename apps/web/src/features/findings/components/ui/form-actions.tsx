import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FormActionsProps = {
  submitLabel: string;
  pending: boolean;
  cancelHref: string;
};

export function FormActions({
  submitLabel,
  pending,
  cancelHref,
}: FormActionsProps) {
  return (
    <div className="flex gap-3">
      <Button type="submit" disabled={pending}>
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        {submitLabel}
      </Button>
      <Button variant="outline" asChild>
        <Link href={cancelHref}>انصراف</Link>
      </Button>
    </div>
  );
}
