import { FolderX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

/** Also shown for another Organization's Projects, whose existence is not disclosed. */
export default function ProjectNotFound() {
  return (
    <Card className="py-0">
      <EmptyState
        icon={FolderX}
        title="Project not found"
        description="It does not exist, or it belongs to another Organization."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.projects()}>Back to Projects</Link>
          </Button>
        }
      />
    </Card>
  );
}
