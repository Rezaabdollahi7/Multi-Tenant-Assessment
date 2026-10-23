import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
import { ProjectInfo } from "@/features/projects/components/project-info";
import { ProjectMembers } from "@/features/projects/components/project-members";
import { ProjectSeverityPanel } from "@/features/projects/components/project-severity-panel";
import { routes } from "@/lib/routes";
import { hasPermissions } from "@/lib/session/permissions";
import { revealOrder } from "@/lib/motion";

type ProjectPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const [project, t] = await Promise.all([
    getProject((await params).id),
    getTranslations("metadata"),
  ]);
  return { title: project?.name ?? t("projectNotFound") };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, user] = await Promise.all([getProject(id), getCurrentUser()]);
  if (!project) notFound();
  const t = await getTranslations("findings");

  const [members, findings] = await Promise.all([
    hasPermissions(user, "member:read") ? getProjectMembers(id) : null,
    getRecentProjectFindings(id),
  ]);

  return (
    <div className="space-y-8">
      <ProjectHeader
        project={project}
        action={
          hasPermissions(user, "finding:create") && (
            <Button asChild>
              <Link href={routes.newFinding({ projectId: id })}>
                <PlusIcon aria-hidden />
                {t("report")}
              </Link>
            </Button>
          )
        }
      />
      <div
        className="reveal grid items-start gap-6 lg:grid-cols-3"
        style={revealOrder(1)}
      >
        <div className="grid gap-6 lg:col-span-2">
          <ProjectSeverityPanel project={project} />
          <RecentProjectFindings projectId={id} findings={findings} />
        </div>
        <div className="grid gap-6">
          <ProjectInfo project={project} />
          {members && <ProjectMembers members={members} />}
        </div>
      </div>
    </div>
  );
}
