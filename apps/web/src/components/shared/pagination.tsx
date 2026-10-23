import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api/types";

type PaginationProps = {
  meta: PaginationMeta;
  /** How many items there are, in words, e.g. "23 Projects". */
  totalLabel: string;
  /** The URL of a page, so pages are real links. */
  hrefForPage: (page: number) => string;
};

/** Previous and next links with the position in the list. */
export function Pagination({ meta, totalLabel, hrefForPage }: PaginationProps) {
  const t = useTranslations("pagination");
  const { page, totalPages } = meta;
  return (
    <nav
      aria-label={t("label")}
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-muted-foreground tabular-nums">
        {totalLabel}
        {totalPages > 1 && ` · ${t("page", { page, total: totalPages })}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <PageLink
            href={hrefForPage(page - 1)}
            disabled={page <= 1}
            label={t("previousLabel")}
          >
            {/* Chevrons point along the reading direction. */}
            <ChevronLeft aria-hidden className="rtl:rotate-180" />
            {t("previous")}
          </PageLink>
          <PageLink
            href={hrefForPage(page + 1)}
            disabled={page >= totalPages}
            label={t("nextLabel")}
          >
            {t("next")}
            <ChevronRight aria-hidden className="rtl:rotate-180" />
          </PageLink>
        </div>
      )}
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={href} aria-label={label} scroll={false}>
        {children}
      </Link>
    </Button>
  );
}
