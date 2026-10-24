import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { H1, Muted } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { EditFindingForm } from "@/features/findings/components/block/finding-form";
import { getFinding } from "@/features/findings/lib/findings-api";
import { revealOrder } from "@/lib/motion";
import { routes } from "@/lib/routes";
import { can } from "@/lib/session/permissions";

type EditFindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: EditFindingPageProps): Promise<Metadata> {
  const finding = await getFinding((await params).id);
  return { title: finding ? `ویرایش ${finding.title}` : "یافته پیدا نشد" };
}

export default async function EditFindingPage({
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
    <div className="space-y-8">
      <header className="reveal space-y-1" style={revealOrder(0)}>
        <H1 className="text-display font-light text-start">ویرایش یافته</H1>
        <Muted className="truncate text-sm">
          {finding.title}
        </Muted>
      </header>
      <Card
        className="reveal max-w-3xl rounded-3xl p-6 sm:p-8"
        style={revealOrder(1)}
      >
        <EditFindingForm finding={finding} />
      </Card>
    </div>
  );
}
