import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { getRecentProjectFindings } from "@/features/findings/api/get-finding";
import { RecentProjectFindings } from "@/features/findings/components/recent-project-findings";
import {
  getProject,
  getProjectMembers,
} from "@/features/projects/api/get-project";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectMembers } from "@/features/projects/components/project-members";
import { ProjectSeverityPanel } from "@/features/projects/components/project-severity-panel";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";

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

  const [members, findings] = await Promise.all([
    hasPermissions(user, "member:read") ? getProjectMembers(id) : null,
    getRecentProjectFindings(id),
  ]);

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        action={
          hasPermissions(user, "finding:create") && (
            <Button size="sm" asChild>
              <Link href={routes.newFinding({ projectId: id })}>
                <PlusIcon aria-hidden />
                Report Finding
              </Link>
            </Button>
          )
        }
      />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <ProjectSeverityPanel project={project} />
        {members && <ProjectMembers members={members} />}
      </div>
      <RecentProjectFindings projectId={id} findings={findings} />
    </div>
  );
}
