import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProjectsList } from "@/features/projects/components/projects-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return { title: t("projects") };
}

export default async function ProjectsPage() {
  const t = await getTranslations("projects");
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("intro")}</p>
      </header>
      <ProjectsList />
    </div>
  );
}
