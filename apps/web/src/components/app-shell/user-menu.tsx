"use client";

import { LogOutIcon } from "lucide-react";
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
import { ROLE_LABELS } from "@/lib/session/roles";
import { useCurrentUser } from "@/lib/session/session-provider";
import { ShellButton } from "./shell-button";

export function UserMenu() {
  const user = useCurrentUser();
  const { signOut, pending } = useSignOut();
  const displayName = user.name ?? user.phone;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ShellButton className="text-xs font-medium">
          <span aria-hidden>{initials(user.name, user.phone)}</span>
          <span className="sr-only">منوی کاربری {displayName}</span>
        </ShellButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <bdi className="block font-medium">{displayName}</bdi>
          <span className="block text-xs text-muted-foreground">
            {ROLE_LABELS[user.role]} · <bdi>{user.organization.name}</bdi>
          </span>
          <span
            dir="ltr"
            className="block text-start text-xs text-muted-foreground tabular-nums"
          >
            {user.phone}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pending} onSelect={signOut}>
          <LogOutIcon aria-hidden />
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
