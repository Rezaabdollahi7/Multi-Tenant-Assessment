import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import {
  getProject,
  getProjectMembers,
} from "@/features/projects/api/get-project";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectMembers } from "@/features/projects/components/project-members";
import { ProjectSeverityPanel } from "@/features/projects/components/project-severity-panel";

type ProjectPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject((await params).id);
  return { title: project?.name ?? "Project not found" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, user] = await Promise.all([getProject(id), getCurrentUser()]);
  if (!project) notFound();

  const canReadMembers = user?.permissions.includes("member:read") ?? false;
  const members = canReadMembers ? await getProjectMembers(id) : null;

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ProjectSeverityPanel project={project} />
        {members && <ProjectMembers members={members} />}
      </div>
    </div>
  );
}
