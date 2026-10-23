import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFinding } from "@/features/findings/api/get-finding";
import { FindingActions } from "@/features/findings/components/finding-actions";
import { FindingDetails } from "@/features/findings/components/finding-details";

type FindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: FindingPageProps): Promise<Metadata> {
  const finding = await getFinding((await params).id);
  return { title: finding?.title ?? "Finding not found" };
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
