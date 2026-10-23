import type { Permission } from "@/lib/api/types";
import { routes } from "@/lib/routes";

export type NavItem = {
  /** Key under `nav` in the messages. */
  labelKey: "dashboard" | "projects" | "findings";
  href: string;
  /** Shown only to Users who hold it. */
  permission: Permission;
};

export const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "dashboard",
    href: routes.dashboard(),
    permission: "dashboard:read",
  },
  {
    labelKey: "projects",
    href: routes.projects(),
    permission: "project:read",
  },
  {
    labelKey: "findings",
    href: routes.findings(),
    permission: "finding:read",
  },
];

/** A section is active on its own page and on every page below it. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
