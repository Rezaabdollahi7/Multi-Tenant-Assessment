import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PaginationMeta } from "@/assets/types/api";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GAP, pageItems } from "./page-items";

export { pageItems } from "./page-items";

function pageLabel(page: number, total: number) {
  return `صفحهٔ ${formatNumber(page)} از ${formatNumber(total)}`;
}

type PaginationProps = {
  meta: PaginationMeta;
  totalLabel: string;
  hrefForPage: (page: number) => string;
};

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
              <ArrowRight aria-hidden className="size-4" />
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
              <ArrowLeft aria-hidden className="size-4" />
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
