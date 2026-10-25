import Link from "next/link";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { H1, Muted } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { CreateFindingForm } from "@/features/findings/components/block/finding-form";
import { listProjectOptions } from "@/features/findings/lib/findings-api";
import { routes } from "@/lib/routes";
import { can } from "@/lib/session/permissions";
import SectionLayout from "@/components/shared/section-layout";

type NewFindingPageProps = {
  searchParams: Promise<{ projectId?: string | string[] }>;
};

export default async function page({
  searchParams,
}: NewFindingPageProps) {
  const [user, { projectId }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (!can(user, "finding", "create")) {
    return (
      <PermissionDenied
        title="شما نمی‌توانید یافته ثبت کنید"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings()}>بازگشت به یافته‌ها</Link>
          </Button>
        }
      />
    );
  }

  const projectOptions = await listProjectOptions();

  return (
    <SectionLayout>
      <header className="space-y-1">
        <H1 className="text-display font-light text-start">ثبت یافته</H1>
        <Muted>
          یافته‌های جدید با وضعیت «باز» ثبت می‌شوند.
        </Muted>
      </header>
      <Card
        className="max-w-3xl rounded-3xl p-6 sm:p-8"
      >
        <CreateFindingForm
          projectOptions={projectOptions}
          defaultProjectId={
            typeof projectId === "string" ? projectId : undefined
          }
        />
      </Card>
    </SectionLayout>
  );
}
