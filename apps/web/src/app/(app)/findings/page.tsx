import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H1, Muted } from "@/components/shared/typography";
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
import SectionLayout from "@/components/shared/section-layout";

type FindingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function page({
  searchParams,
}: FindingsPageProps) {
  const params = findingListParamsSchema.parse(await searchParams);
  const [findings, projectOptions, user] = await Promise.all([
    listFindings(params),
    listProjectOptions(),
    getCurrentUser(),
  ]);

  return (
    <SectionLayout>
      <header
        className="reveal flex flex-wrap items-start justify-between gap-3"
        style={revealOrder(0)}
      >
        <div className="space-y-1">
          <H1 className="text-display font-light text-start">یافته‌ها</H1>
          <Muted>
            همهٔ یافته‌های ثبت‌شده در پروژه‌های سازمان شما.
          </Muted>
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
    </SectionLayout>
  );
}
