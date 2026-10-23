import { ShieldX } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";

type PermissionDeniedProps = {
  title: string;
  action?: ReactNode;
};

export function PermissionDenied({ title, action }: PermissionDeniedProps) {
  return (
    <Card className="py-0">
      <EmptyState
        icon={ShieldX}
        title={title}
        titleAs="h1"
        description="نقش شما این مجوز را ندارد. اگر به آن نیاز دارید، از یک مدیر بخواهید."
        action={action}
      />
    </Card>
  );
}
