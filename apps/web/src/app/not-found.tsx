import { MapPinOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "صفحه پیدا نشد" };

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md py-0">
        <EmptyState
          icon={MapPinOff}
          title="صفحه پیدا نشد"
          titleAs="h1"
          description="این نشانی وجود ندارد یا جابه‌جا شده است."
          action={
            <Button size="sm" asChild>
              <Link href={routes.dashboard()}>رفتن به داشبورد</Link>
            </Button>
          }
        />
      </Card>
    </main>
  );
}
