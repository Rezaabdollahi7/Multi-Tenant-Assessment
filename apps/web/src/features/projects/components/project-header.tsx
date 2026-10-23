import { ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectDetail } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { ProjectStatusBadge } from "./project-status-badge";

type ProjectHeaderProps = {
  project: ProjectDetail;
  /** A primary action beside the title, shown by Permission. */
  action?: ReactNode;
};

export function ProjectHeader({ project, action }: ProjectHeaderProps) {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <header className="space-y-3">
      <nav aria-label={t("common.breadcrumb")}>
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={routes.projects()}
              className="rounded-sm hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t("nav.projects")}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5 rtl:rotate-180" />
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
        {t("projects.details.summary", {
          findings: project.findingsCount,
          members: project.membersCount,
          created: format.dateTime(new Date(project.createdAt), "date"),
        })}
      </p>
    </header>
  );
}
