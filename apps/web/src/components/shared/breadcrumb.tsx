import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";

type BreadcrumbItem = {
  label: ReactNode;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر صفحه">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              {index > 0 && (
                <li aria-hidden>
                  <ChevronLeft className="size-3.5" />
                </li>
              )}
              <li
                className={isLast ? "truncate text-foreground" : undefined}
                aria-current={isLast ? "page" : undefined}
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded-sm hover:text-foreground hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
