import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { RecentProjectFindings } from "@/features/findings/components/block/recent-project-findings";
import { getRecentProjectFindings } from "@/features/findings/lib/findings-api";
import { ProjectHeader } from "@/features/projects/components/block/project-header";
import { ProjectInfo } from "@/features/projects/components/block/project-info";
import { ProjectMembers } from "@/features/projects/components/block/project-members";
import { ProjectSeverityPanel } from "@/features/projects/components/block/project-severity-panel";
import {
  getProject,
  getProjectMembers,
} from "@/features/projects/lib/projects-api";
import { revealOrder } from "@/lib/motion";
import { routes } from "@/lib/routes";
import { can } from "@/lib/session/permissions";
import SectionLayout from "@/components/shared/section-layout";

type ProjectPageProps = { params: Promise<{ id: string }> };

export default async function page({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, user] = await Promise.all([getProject(id), getCurrentUser()]);
  if (!project) notFound();

  const [members, findings] = await Promise.all([
    can(user, "member", "read") ? getProjectMembers(id) : null,
    getRecentProjectFindings(id),
  ]);

  return (
    <SectionLayout>
      <ProjectHeader
        project={project}
        action={
          can(user, "finding", "create") && (
            <Button asChild>
              <Link href={routes.newFinding({ projectId: id })}>
                <PlusIcon aria-hidden />
                ثبت یافته
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
    </SectionLayout>
  );
}
