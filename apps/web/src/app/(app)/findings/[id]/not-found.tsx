import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export default function FindingNotFound() {
  return (
    <Card className="py-0">
      <EmptyState
        icon={SearchX}
        title="یافته پیدا نشد"
        titleAs="h1"
        description="وجود ندارد، حذف شده یا متعلق به سازمان دیگری است."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings()}>بازگشت به یافته‌ها</Link>
          </Button>
        }
      />
    </Card>
  );
}
