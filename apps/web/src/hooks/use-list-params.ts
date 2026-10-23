"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { z } from "zod";

type ListParams = { page: number };

/**
 * The search, filters and page of a list, kept in the URL (ADR 0003).
 * The schema parses the query string and repairs anything invalid, so a
 * hand-edited URL never breaks the page.
 */
export function useListParams<Schema extends z.ZodType<ListParams>>(
  schema: Schema,
) {
  type Params = z.output<Schema>;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params: Params = schema.parse(Object.fromEntries(searchParams));

  /** The URL with `patch` applied. Changing anything but the page returns to page 1. */
  function hrefWith(patch: Partial<Params>) {
    const next: Record<string, unknown> = { ...params, page: 1, ...patch };
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      const isDefault = key === "page" && value === 1;
      if (value !== undefined && value !== "" && !isDefault) {
        query.set(key, String(value));
      }
    }
    const search = query.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  function update(patch: Partial<Params>) {
    router.replace(hrefWith(patch), { scroll: false });
  }

  return { params, hrefWith, update };
}
