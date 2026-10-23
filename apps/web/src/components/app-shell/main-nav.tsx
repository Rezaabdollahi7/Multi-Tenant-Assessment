"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/session/session-provider";
import { cn } from "@/lib/utils";
import { isActive, NAV_ITEMS } from "./nav-items";

/** Sections as pills; the current one is filled with ink. */
export function MainNav({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { permissions } = useCurrentUser();
  const items = NAV_ITEMS.filter((item) =>
    permissions.includes(item.permission),
  );

  return (
    <nav aria-label={t("label")} className={className}>
      <ul className="glass flex w-full gap-1 overflow-x-auto rounded-full p-1 md:w-auto">
        {items.map(({ labelKey, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center justify-center rounded-full px-5 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
