import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api/types";
import { formatCount } from "@/lib/format";

type PaginationProps = {
  meta: PaginationMeta;
  /** Singular name of what is listed, e.g. "Project". */
  itemName: string;
  /** The URL of a page, so pages are real links. */
  hrefForPage: (page: number) => string;
};

/** Previous and next links with the position in the list. */
export function Pagination({ meta, itemName, hrefForPage }: PaginationProps) {
  const { page, totalPages, totalItems } = meta;
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-muted-foreground tabular-nums">
        {formatCount(totalItems, itemName)}
        {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <PageLink
            href={hrefForPage(page - 1)}
            disabled={page <= 1}
            label="Previous page"
          >
            <ChevronLeft aria-hidden />
            Previous
          </PageLink>
          <PageLink
            href={hrefForPage(page + 1)}
            disabled={page >= totalPages}
            label="Next page"
          >
            Next
            <ChevronRight aria-hidden />
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
