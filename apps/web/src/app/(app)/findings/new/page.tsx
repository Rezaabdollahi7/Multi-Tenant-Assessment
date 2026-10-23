import type { Metadata } from "next";
import Link from "next/link";
import { PermissionDenied } from "@/components/shared/permission-denied";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { CreateFindingForm } from "@/features/findings/components/finding-form";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";

export const metadata: Metadata = { title: "Report Finding" };

type NewFindingPageProps = {
  searchParams: Promise<{ projectId?: string | string[] }>;
};

export default async function NewFindingPage({
  searchParams,
}: NewFindingPageProps) {
  const [user, { projectId }] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (!hasPermissions(user, "finding:create")) {
    return (
      <PermissionDenied
        title="You cannot report Findings"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings()}>Back to Findings</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Report Finding</h1>
        <p className="text-sm text-muted-foreground">
          New Findings start as Open.
        </p>
      </header>
      <CreateFindingForm
        defaultProjectId={typeof projectId === "string" ? projectId : undefined}
      />
    </div>
  );
}
