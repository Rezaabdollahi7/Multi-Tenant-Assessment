"use client";

import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/components/shared/user-avatar";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useCurrentUser } from "@/lib/session/session-provider";
import { ShellButton } from "./shell-button";

export function UserMenu() {
  const user = useCurrentUser();
  const signOut = useSignOut();
  const t = useTranslations();
  const displayName = user.name ?? user.phone;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ShellButton className="text-xs font-medium">
          {/* The name is spoken in full; the initials are only its picture. */}
          <span aria-hidden>{initials(user.name, user.phone)}</span>
          <span className="sr-only">
            {t("userMenu.trigger", { name: displayName })}
          </span>
        </ShellButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <bdi className="block font-medium">{displayName}</bdi>
          <span className="block text-xs text-muted-foreground">
            {t(`roles.${user.role}`)} · <bdi>{user.organization.name}</bdi>
          </span>
          <span
            dir="ltr"
            className="block text-start text-xs text-muted-foreground tabular-nums"
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
