import { ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { routes } from "@/lib/routes";

/** The product's name in an outlined pill, linking home. */
export function BrandMark() {
  const t = useTranslations("common");
  return (
    <Link
      href={routes.dashboard()}
      className="flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-base font-medium transition-colors hover:bg-card"
    >
      <ShieldCheckIcon aria-hidden className="size-5" />
      {t("appShortName")}
    </Link>
  );
}
