import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { CreateFindingForm } from "@/features/findings/components/finding-form";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("reportFinding") };
}

type NewFindingPageProps = {
  searchParams: Promise<{ projectId?: string | string[] }>;
};

export default async function NewFindingPage({
  searchParams,
}: NewFindingPageProps) {
  const [user, { projectId }, t] = await Promise.all([
    getCurrentUser(),
    searchParams,
    getTranslations("findings"),
  ]);

  if (!hasPermissions(user, "finding:create")) {
    return (
      <PermissionDenied
        title={t("form.cannotReport")}
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings()}>{t("details.back")}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-display font-light">{t("form.newTitle")}</h1>
        <p className="text-muted-foreground">{t("form.newIntro")}</p>
      </header>
      <Card className="max-w-3xl rounded-3xl p-6 sm:p-8">
        <CreateFindingForm
          defaultProjectId={
            typeof projectId === "string" ? projectId : undefined
          }
        />
      </Card>
    </div>
  );
}
