"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { z } from "zod";

type ListParams = { page: number };

export function useListParams<Schema extends z.ZodType<ListParams>>(
  schema: Schema,
) {
  type Params = z.output<Schema>;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const params: Params = schema.parse(Object.fromEntries(searchParams));

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
    startTransition(() => router.replace(hrefWith(patch), { scroll: false }));
  }

  return { params, hrefWith, update, pending };
}
