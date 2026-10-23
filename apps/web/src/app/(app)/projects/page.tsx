import type { Metadata } from "next";
import { ProjectsList } from "@/features/projects/components/projects-list";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Every security assessment Project in your Organization.
        </p>
      </header>
      <ProjectsList />
    </div>
  );
}
