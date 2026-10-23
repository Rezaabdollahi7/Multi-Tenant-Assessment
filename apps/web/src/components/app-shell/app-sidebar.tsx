"use client";

import { ShieldCheckIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LOCALE_DIRECTIONS } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/session/session-provider";
import { isActive, NAV_ITEMS } from "./nav-items";
import { UserMenu } from "./user-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const direction = LOCALE_DIRECTIONS[useLocale()];
  const { organization, permissions } = useCurrentUser();
  const items = NAV_ITEMS.filter((item) =>
    permissions.includes(item.permission),
  );

  // The sidebar sits where reading starts: the right edge in Persian.
  return (
    <Sidebar collapsible="icon" side={direction === "rtl" ? "right" : "left"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routes.dashboard()}>
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                  <ShieldCheckIcon className="size-4" aria-hidden />
                </span>
                <span className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {t("common.appShortName")}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {organization.name}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label={t("nav.label")}>
              <SidebarMenu>
                {items.map(({ labelKey, href, icon: Icon }) => {
                  const active = isActive(pathname, href);
                  const label = t(`nav.${labelKey}`);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={label}
                      >
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon aria-hidden />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
