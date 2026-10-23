import { ShieldX } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";

type PermissionDeniedProps = {
  /** What the User cannot do, e.g. "You cannot report Findings". */
  title: string;
  /** A way out, such as a link back. */
  action?: ReactNode;
};

/** Shown on a page the User's Role has no Permission for. */
export function PermissionDenied({ title, action }: PermissionDeniedProps) {
  return (
    <Card className="py-0">
      <EmptyState
        icon={ShieldX}
        title={title}
        description="Your Role does not include this Permission. Ask an Admin if you need it."
        action={action}
      />
    </Card>
  );
}
