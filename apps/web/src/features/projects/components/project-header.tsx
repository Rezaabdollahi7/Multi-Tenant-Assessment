import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectDetail } from "@/lib/api/types";
import { formatCount, formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { ProjectStatusBadge } from "./project-status-badge";

type ProjectHeaderProps = {
  project: ProjectDetail;
  /** A primary action beside the title, shown by Permission. */
  action?: ReactNode;
};

export function ProjectHeader({ project, action }: ProjectHeaderProps) {
  return (
    <header className="space-y-3">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={routes.projects()}
              className="rounded-sm hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Projects
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="truncate text-foreground">
            {project.name}
          </li>
        </ol>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        {action}
      </div>
      {project.description && (
        <p className="max-w-prose text-sm text-muted-foreground">
          {project.description}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        {formatCount(project.findingsCount, "Finding")} ·{" "}
        {formatCount(project.membersCount, "Member")} · Created{" "}
        {formatDate(project.createdAt)}
      </p>
    </header>
  );
}
