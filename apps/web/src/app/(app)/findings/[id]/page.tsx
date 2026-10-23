import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FindingDetails } from "@/features/findings/components/block/finding-details";
import { FindingActions } from "@/features/findings/components/ui/finding-actions";
import { getFinding } from "@/features/findings/lib/findings-api";

type FindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: FindingPageProps): Promise<Metadata> {
  const finding = await getFinding((await params).id);
  return { title: finding?.title ?? "یافته پیدا نشد" };
}

export default async function FindingPage({ params }: FindingPageProps) {
  const finding = await getFinding((await params).id);
  if (!finding) notFound();

  return (
    <FindingDetails
      finding={finding}
      actions={<FindingActions finding={finding} />}
    />
  );
}
