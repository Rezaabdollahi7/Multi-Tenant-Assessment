import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectDetail } from "@/assets/types/project";
import { H1, Muted } from "@/components/shared/typography";
import { routes } from "@/lib/routes";
import { ProjectStatusBadge } from "../ui/project-status-badge";
import { revealOrder } from "@/lib/motion";

type ProjectHeaderProps = {
  project: ProjectDetail;
  action?: ReactNode;
};

export function ProjectHeader({ project, action }: ProjectHeaderProps) {
  return (
    <header className="reveal space-y-4" style={revealOrder(0)}>
      <nav aria-label="مسیر صفحه">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={routes.projects()}
              className="rounded-sm hover:text-foreground hover:underline"
            >
              پروژه‌ها
            </Link>
          </li>
          <li aria-hidden>
            <ChevronLeft className="size-3.5" />
          </li>
          <li aria-current="page" className="truncate text-foreground">
            <bdi>{project.name}</bdi>
          </li>
        </ol>
      </nav>
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
