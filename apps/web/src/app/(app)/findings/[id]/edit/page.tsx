import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { getFinding } from "@/features/findings/api/get-finding";
import { EditFindingForm } from "@/features/findings/components/finding-form";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";

type EditFindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: EditFindingPageProps): Promise<Metadata> {
  const finding = await getFinding((await params).id);
  return { title: finding ? `Edit ${finding.title}` : "Finding not found" };
}

export default async function EditFindingPage({
  params,
}: EditFindingPageProps) {
  const { id } = await params;
  const [finding, user] = await Promise.all([getFinding(id), getCurrentUser()]);
  if (!finding) notFound();

  if (!hasPermissions(user, "finding:update")) {
    return (
      <PermissionDenied
        title="You cannot edit Findings"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.finding(id)}>Back to the Finding</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Edit Finding</h1>
        <p className="truncate text-sm text-muted-foreground">
          {finding.title}
        </p>
      </header>
      <EditFindingForm finding={finding} />
    </div>
  );
}
