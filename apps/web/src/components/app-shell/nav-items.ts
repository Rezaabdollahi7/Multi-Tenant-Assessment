import {
  FolderKanbanIcon,
  LayoutDashboardIcon,
  ShieldAlertIcon,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/api/types";
import { routes } from "@/lib/routes";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown only to Users who hold it. */
  permission: Permission;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: routes.dashboard(),
    icon: LayoutDashboardIcon,
    permission: "dashboard:read",
  },
  {
    label: "Projects",
    href: routes.projects(),
    icon: FolderKanbanIcon,
    permission: "project:read",
  },
  {
    label: "Findings",
    href: routes.findings(),
    icon: ShieldAlertIcon,
    permission: "finding:read",
  },
];

/** A section is active on its own page and on every page below it. */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
