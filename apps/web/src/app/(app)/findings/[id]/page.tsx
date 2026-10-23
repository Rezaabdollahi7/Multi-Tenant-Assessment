import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getFinding } from "@/features/findings/api/get-finding";
import { FindingActions } from "@/features/findings/components/finding-actions";
import { FindingDetails } from "@/features/findings/components/finding-details";

type FindingPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: FindingPageProps): Promise<Metadata> {
  const [finding, t] = await Promise.all([
    getFinding((await params).id),
    getTranslations("metadata"),
  ]);
  return { title: finding?.title ?? t("findingNotFound") };
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
