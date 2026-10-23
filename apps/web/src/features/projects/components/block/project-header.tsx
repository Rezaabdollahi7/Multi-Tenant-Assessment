import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectDetail } from "@/assets/types/project";
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
            <h1 className="text-display font-light">
              <bdi>{project.name}</bdi>
            </h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.description && (
            <p dir="auto" className="max-w-prose text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
