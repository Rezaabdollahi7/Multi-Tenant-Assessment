import { MapPinOff } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("pageNotFound") };
}

/** Any address no route matches; signed out, the Dashboard link leads to sign-in. */
export default async function NotFound() {
  const t = await getTranslations("pageNotFound");
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md py-0">
        <EmptyState
          icon={MapPinOff}
          title={t("title")}
          titleAs="h1"
          description={t("description")}
          action={
            <Button size="sm" asChild>
              <Link href={routes.dashboard()}>{t("home")}</Link>
            </Button>
          }
        />
      </Card>
    </main>
  );
}
