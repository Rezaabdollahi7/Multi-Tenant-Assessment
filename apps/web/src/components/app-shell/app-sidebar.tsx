"use client";

import { ShieldCheckIcon } from "lucide-react";
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
import { useCurrentUser } from "@/features/auth/components/session-provider";
import { routes } from "@/lib/routes";
import { isActive, NAV_ITEMS } from "./nav-items";
import { UserMenu } from "./user-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const { organization, permissions } = useCurrentUser();
  const items = NAV_ITEMS.filter((item) =>
    permissions.includes(item.permission),
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routes.dashboard()}>
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                  <ShieldCheckIcon className="size-4" aria-hidden />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Secure Assessment
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
            <nav aria-label="Main">
              <SidebarMenu>
                {items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(pathname, href);
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
