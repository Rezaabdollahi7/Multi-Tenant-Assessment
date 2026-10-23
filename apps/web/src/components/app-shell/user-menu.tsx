"use client";

import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useCurrentUser } from "@/lib/session/session-provider";

function initials(name: string | null, fallback: string): string {
  const letters = (name ?? fallback)
    .split(/\s+/)
    .map((part) => part[0])
    .join("");
  return letters.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const user = useCurrentUser();
  const signOut = useSignOut();
  const t = useTranslations();
  const displayName = user.name ?? user.phone;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent"
          aria-label={t("userMenu.trigger", { name: displayName })}
        >
          <Avatar className="size-8 rounded-md">
            <AvatarFallback className="bg-primary text-primary-foreground rounded-md text-xs">
              {initials(user.name, user.phone)}
            </AvatarFallback>
          </Avatar>
          <span className="grid flex-1 text-start text-sm leading-tight">
            <span className="truncate font-medium">{displayName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {t(`roles.${user.role}`)} · {user.organization.name}
            </span>
          </span>
          <ChevronsUpDownIcon className="ms-auto" aria-hidden />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block font-medium">{displayName}</span>
          <span
            dir="ltr"
            className="text-muted-foreground block text-start text-xs tabular-nums"
          >
            {user.phone}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signOut.isPending}
          onSelect={() => signOut.mutate()}
        >
          <LogOutIcon aria-hidden />
          {t("userMenu.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
