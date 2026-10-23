import { FolderX } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/lib/routes";

/** Also shown for another Organization's Projects, whose existence is not disclosed. */
export default async function ProjectNotFound() {
  const t = await getTranslations("projects.details");
  return (
    <Card className="py-0">
      <EmptyState
        icon={FolderX}
        title={t("notFound")}
        description={t("notFoundDescription")}
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.projects()}>{t("back")}</Link>
          </Button>
        }
      />
    </Card>
  );
}
