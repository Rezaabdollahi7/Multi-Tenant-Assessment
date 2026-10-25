import type { ReactNode } from "react";
import type { ProjectDetail } from "@/assets/types/project";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { H1, Muted } from "@/components/shared/typography";
import { routes } from "@/lib/routes";
import { revealOrder } from "@/lib/motion";
import { ProjectStatusBadge } from "../ui/project-status-badge";

type ProjectHeaderProps = {
  project: ProjectDetail;
  action?: ReactNode;
};

export function ProjectHeader({ project, action }: ProjectHeaderProps) {
  return (
    <header className="reveal space-y-4" style={revealOrder(0)}>
      <Breadcrumb
        items={[
          { label: "پروژه‌ها", href: routes.projects() },
          { label: <bdi>{project.name}</bdi> },
        ]}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <H1 className="text-display font-light text-start">
              <bdi>{project.name}</bdi>
            </H1>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.description && (
            <Muted dir="auto" className="max-w-prose">
              {project.description}
            </Muted>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
