import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { getFinding } from "@/features/findings/api/get-finding";
import { EditFindingForm } from "@/features/findings/components/finding-form";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";

type EditFindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: EditFindingPageProps): Promise<Metadata> {
  const [finding, t] = await Promise.all([
    getFinding((await params).id),
    getTranslations("metadata"),
  ]);
  return {
    title: finding
      ? t("editFinding", { title: finding.title })
      : t("findingNotFound"),
  };
}

export default async function EditFindingPage({
  params,
}: EditFindingPageProps) {
  const { id } = await params;
  const [finding, user] = await Promise.all([getFinding(id), getCurrentUser()]);
  if (!finding) notFound();
  const t = await getTranslations("findings");

  if (!hasPermissions(user, "finding:update")) {
    return (
      <PermissionDenied
        title={t("form.cannotEdit")}
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.finding(id)}>{t("details.backToFinding")}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-display font-light">{t("form.editTitle")}</h1>
        <p className="truncate text-sm text-muted-foreground">
          {finding.title}
        </p>
      </header>
      <Card className="max-w-3xl rounded-3xl p-6 sm:p-8">
        <EditFindingForm finding={finding} />
      </Card>
    </div>
  );
}
