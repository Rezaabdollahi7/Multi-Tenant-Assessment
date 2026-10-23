import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { FindingsList } from "@/features/findings/components/block/findings-list";
import {
  listFindings,
  listProjectOptions,
} from "@/features/findings/lib/findings-api";
import { findingListParamsSchema } from "@/features/findings/lib/schemas";
import { revealOrder } from "@/lib/motion";
import { routes } from "@/lib/routes";
import { can } from "@/lib/session/permissions";

export const metadata: Metadata = { title: "یافته‌ها" };

type FindingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FindingsPage({
  searchParams,
}: FindingsPageProps) {
  const params = findingListParamsSchema.parse(await searchParams);
  const [findings, projectOptions, user] = await Promise.all([
    listFindings(params),
    listProjectOptions(),
    getCurrentUser(),
  ]);

  return (
    <div className="space-y-8">
      <header
        className="reveal flex flex-wrap items-start justify-between gap-3"
        style={revealOrder(0)}
      >
        <div className="space-y-1">
          <h1 className="text-display font-light">یافته‌ها</h1>
          <p className="text-muted-foreground">
            همهٔ یافته‌های ثبت‌شده در پروژه‌های سازمان شما.
          </p>
        </div>
        {can(user, "finding", "create") && (
          <Button asChild>
            <Link href={routes.newFinding()}>
              <PlusIcon aria-hidden />
              ثبت یافته
            </Link>
          </Button>
        )}
      </header>
      <div className="reveal" style={revealOrder(1)}>
        <FindingsList findings={findings} projectOptions={projectOptions} />
      </div>
    </div>
  );
}
