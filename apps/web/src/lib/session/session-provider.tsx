"use client";

import { createContext, useContext, type ReactNode } from "react";
import type {
  PermissionAction,
  PermissionResource,
} from "@/assets/types/permissions";
import type { CurrentUser } from "@/assets/types/user";
import { can } from "./permissions";

const SessionContext = createContext<CurrentUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: CurrentUser;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useCurrentUser(): CurrentUser {
  const user = useContext(SessionContext);
  if (!user) {
    throw new Error("useCurrentUser must be used inside <SessionProvider>");
  }
  return user;
}

export function useCan<Resource extends PermissionResource>(
  resource: Resource,
  action: PermissionAction<Resource>,
): boolean {
  return can(useCurrentUser(), resource, action);
}
