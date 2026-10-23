"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { can } from "@/lib/session/permissions";
import { useCurrentUser } from "@/lib/session/session-provider";
import { cn } from "@/lib/utils";
import { isActive, NAV_ITEMS } from "./nav-items";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const items = NAV_ITEMS.filter((item) => can(user, item.resource, "read"));

  return (
    <nav aria-label="اصلی" className={className}>
      <ul className="glass flex w-full gap-1 overflow-x-auto rounded-full p-1 md:w-auto">
        {items.map(({ label, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="relative flex-1 md:flex-none">
              {active && (
                <motion.span
                  layoutId="main-nav-current"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-9 items-center justify-center rounded-full px-5 text-sm whitespace-nowrap transition-colors duration-300",
                  active
                    ? "text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
