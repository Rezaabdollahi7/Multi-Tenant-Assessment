import { SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

/** Also shown for another Organization's Findings, whose existence is not disclosed. */
export default function FindingNotFound() {
  return (
    <Card className="py-0">
      <EmptyState
        icon={SearchX}
        title="Finding not found"
        description="It does not exist, was deleted, or belongs to another Organization."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.findings()}>Back to Findings</Link>
          </Button>
        }
      />
    </Card>
  );
}
