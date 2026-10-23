import type { PermissionResource } from "@/assets/types/permissions";
import { routes } from "@/lib/routes";

type NavItem = {
  label: string;
  href: string;
  resource: PermissionResource;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "داشبورد", href: routes.dashboard(), resource: "dashboard" },
  { label: "پروژه‌ها", href: routes.projects(), resource: "project" },
  { label: "یافته‌ها", href: routes.findings(), resource: "finding" },
];

export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
