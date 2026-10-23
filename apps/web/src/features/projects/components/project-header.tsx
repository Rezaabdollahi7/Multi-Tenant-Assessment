import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  return (
    <header className="space-y-4">
      <nav aria-label={t("common.breadcrumb")}>
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href={routes.projects()}
              className="rounded-sm hover:text-foreground hover:underline"
            >
              {t("nav.projects")}
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5 rtl:rotate-180" />
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
