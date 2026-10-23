import type { Metadata } from "next";
import { ProjectsList } from "@/features/projects/components/block/projects-list";
import { listProjects } from "@/features/projects/lib/projects-api";
import { projectListParamsSchema } from "@/features/projects/lib/schemas";
import { revealOrder } from "@/lib/motion";

export const metadata: Metadata = { title: "پروژه‌ها" };

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = projectListParamsSchema.parse(await searchParams);
  const projects = await listProjects(params);

  return (
    <div className="space-y-8">
      <header className="reveal space-y-1" style={revealOrder(0)}>
        <h1 className="text-display font-light">پروژه‌ها</h1>
        <p className="text-muted-foreground">
          همهٔ پروژه‌های ارزیابی امنیت سازمان شما.
        </p>
      </header>
      <div className="reveal" style={revealOrder(1)}>
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
}
