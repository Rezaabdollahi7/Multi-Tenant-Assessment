import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PaginationMeta } from "@/assets/types/api";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const GAP = "gap" as const;

/**
 * The pages to offer: always the first and last, the current one and its
 * neighbours, and a gap wherever pages are skipped. `[1, gap, 4, 5, 6, gap, 9]`.
 */
export function pageItems(
  page: number,
  totalPages: number,
): (number | typeof GAP)[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const shown = [...pages]
    .filter((candidate) => candidate >= 1 && candidate <= totalPages)
    .sort((a, b) => a - b);
  return shown.flatMap((current, index) => {
    const previous = shown[index - 1];
    return previous !== undefined && current - previous > 1
      ? [GAP, current]
      : [current];
  });
}

function pageLabel(page: number, total: number) {
  return `صفحهٔ ${formatNumber(page)} از ${formatNumber(total)}`;
}

type PaginationProps = {
  meta: PaginationMeta;
  /** How many items there are, in words, e.g. "23 Projects". */
  totalLabel: string;
  /** The URL of a page, so pages are real links. */
  hrefForPage: (page: number) => string;
};

/** The position in a list, with round links to the neighbouring and numbered pages. */
export function Pagination({ meta, totalLabel, hrefForPage }: PaginationProps) {
  const { page, totalPages } = meta;

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      <p className="text-muted-foreground tabular-nums">
        {totalLabel}
        {totalPages > 1 && ` · ${pageLabel(page, totalPages)}`}
      </p>
      {totalPages > 1 && (
        <ol className="flex items-center gap-1.5">
          <li>
            <PageLink
              href={page > 1 ? hrefForPage(page - 1) : undefined}
              label="صفحهٔ قبل"
            >
              {/* Arrows point along the reading direction. */}
              <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            </PageLink>
          </li>
          {pageItems(page, totalPages).map((item, index) =>
            item === GAP ? (
              <li
                key={`gap-${index}`}
                aria-hidden
                className="px-1 text-muted-foreground"
              >
                …
              </li>
            ) : (
              <li key={item}>
                <PageLink
                  href={hrefForPage(item)}
                  label={pageLabel(item, totalPages)}
                  current={item === page}
                >
                  {formatNumber(item)}
                </PageLink>
              </li>
            ),
          )}
          <li>
            <PageLink
              href={page < totalPages ? hrefForPage(page + 1) : undefined}
              label="صفحهٔ بعد"
            >
              <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
            </PageLink>
          </li>
        </ol>
      )}
    </nav>
  );
}

function PageLink({
  href,
  label,
  current = false,
  children,
}: {
  /** Undefined when there is no such page, e.g. "previous" on page 1. */
  href: string | undefined;
  label: string;
  current?: boolean;
  children: ReactNode;
}) {
  const classes = cn(
    "flex size-10 items-center justify-center rounded-full tabular-nums transition-colors",
    current
      ? "bg-primary text-primary-foreground"
      : "glass hover:bg-card-solid",
  );
  if (href === undefined) {
    return (
      <span aria-disabled className={cn(classes, "opacity-40")}>
        <span className="sr-only">{label}</span>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      scroll={false}
      className={classes}
    >
      {children}
    </Link>
  );
}
