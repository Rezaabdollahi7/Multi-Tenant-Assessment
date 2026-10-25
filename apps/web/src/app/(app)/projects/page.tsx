import { H1, Muted } from "@/components/shared/typography";
import { ProjectsList } from "@/features/projects/components/block/projects-list";
import { listProjects } from "@/features/projects/lib/projects-api";
import { projectListParamsSchema } from "@/features/projects/lib/schemas";
import SectionLayout from "@/components/shared/section-layout";

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function page({
  searchParams,
}: ProjectsPageProps) {
  const params = projectListParamsSchema.parse(await searchParams);
  const projects = await listProjects(params);

  return (
    <SectionLayout>
      <header className="space-y-1">
        <H1 className="text-display font-light text-start">پروژه‌ها</H1>
        <Muted>
          همهٔ پروژه‌های ارزیابی امنیت سازمان شما.
        </Muted>
      </header>
      <div>
        <ProjectsList projects={projects} />
      </div>
    </SectionLayout>
  );
}
