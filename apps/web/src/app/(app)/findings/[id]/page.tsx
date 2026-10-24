import { notFound } from "next/navigation";
import { FindingDetails } from "@/features/findings/components/block/finding-details";
import { FindingActions } from "@/features/findings/components/ui/finding-actions";
import { getFinding } from "@/features/findings/lib/findings-api";

type FindingPageProps = { params: Promise<{ id: string }> };

export default async function page({ params }: FindingPageProps) {
  const finding = await getFinding((await params).id);
  if (!finding) notFound();

  return (
    <FindingDetails
      finding={finding}
      actions={<FindingActions finding={finding} />}
    />
  );
}
