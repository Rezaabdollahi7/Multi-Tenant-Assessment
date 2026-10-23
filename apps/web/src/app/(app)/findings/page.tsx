import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FindingsList } from "@/features/findings/components/findings-list";
import { routes } from "@/lib/routes";
import { Can } from "@/lib/session/session-provider";
import { revealOrder } from "@/lib/motion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("findings") };
}

export default async function FindingsPage() {
  const t = await getTranslations("findings");
  return (
    <div className="space-y-8">
      <header
        className="reveal flex flex-wrap items-start justify-between gap-3"
        style={revealOrder(0)}
      >
        <div className="space-y-1">
          <h1 className="text-display font-light">{t("title")}</h1>
          <p className="text-muted-foreground">{t("intro")}</p>
        </div>
        <Can permission="finding:create">
          <Button asChild>
            <Link href={routes.newFinding()}>
              <PlusIcon aria-hidden />
              {t("report")}
            </Link>
          </Button>
        </Can>
      </header>
      <div className="reveal" style={revealOrder(1)}>
        <FindingsList />
      </div>
    </div>
  );
}
