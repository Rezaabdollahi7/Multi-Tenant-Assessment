import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectsList } from "@/features/projects/components/projects-list";
import { revealOrder } from "@/lib/motion";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("projects") };
}

export default async function ProjectsPage() {
  const t = await getTranslations("projects");
  return (
    <div className="space-y-8">
      <header className="reveal space-y-1" style={revealOrder(0)}>
        <h1 className="text-display font-light">{t("title")}</h1>
        <p className="text-muted-foreground">{t("intro")}</p>
      </header>
      <div className="reveal" style={revealOrder(1)}>
        <ProjectsList />
      </div>
    </div>
  );
}
