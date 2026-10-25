import Link from "next/link";
import { notFound } from "next/navigation";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { H1, Muted } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { EditFindingForm } from "@/features/findings/components/block/finding-form";
import { getFinding } from "@/features/findings/lib/findings-api";
import { routes } from "@/lib/routes";
import { can } from "@/lib/session/permissions";
import SectionLayout from "@/components/shared/section-layout";

type EditFindingPageProps = { params: Promise<{ id: string }> };

export default async function page({
  params,
}: EditFindingPageProps) {
  const { id } = await params;
  const [finding, user] = await Promise.all([getFinding(id), getCurrentUser()]);
  if (!finding) notFound();

  if (!can(user, "finding", "update")) {
    return (
      <PermissionDenied
        title="شما نمی‌توانید یافته‌ها را ویرایش کنید"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.finding(id)}>بازگشت به یافته</Link>
          </Button>
        }
      />
    );
  }

  return (
    <SectionLayout>
      <header className="space-y-1">
        <H1 className="text-display font-light text-start">ویرایش یافته</H1>
        <Muted className="truncate text-sm">
          {finding.title}
        </Muted>
      </header>
      <Card
        className="max-w-3xl rounded-3xl p-6 sm:p-8"
      >
        <EditFindingForm finding={finding} />
      </Card>
    </SectionLayout>
  );
}
