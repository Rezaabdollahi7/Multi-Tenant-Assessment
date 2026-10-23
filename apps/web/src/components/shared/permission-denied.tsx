import { ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("permissionDenied");
  return (
    <Card className="py-0">
      <EmptyState
        icon={ShieldX}
        title={title}
        description={t("description")}
        action={action}
      />
    </Card>
  );
}
