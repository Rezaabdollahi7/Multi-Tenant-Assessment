import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FindingsList } from "@/features/findings/components/findings-list";
import { routes } from "@/lib/routes";
import { Can } from "@/lib/session/session-provider";

export const metadata: Metadata = { title: "Findings" };

export default function FindingsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Findings</h1>
          <p className="text-sm text-muted-foreground">
            Security issues found across your Organization&apos;s Projects.
          </p>
        </div>
        <Can permission="finding:create">
          <Button size="sm" asChild>
            <Link href={routes.newFinding()}>
              <PlusIcon aria-hidden />
              Report Finding
            </Link>
          </Button>
        </Can>
      </header>
      <FindingsList />
    </div>
  );
}
