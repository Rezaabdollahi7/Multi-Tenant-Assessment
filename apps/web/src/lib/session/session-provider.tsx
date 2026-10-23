"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CurrentUser, Permission } from "@/lib/api/types";
import { hasPermissions } from "./permissions";

const SessionContext = createContext<CurrentUser | null>(null);

/** Makes the User loaded by the protected layout available to client components. */
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

/** Whether the signed-in User holds every given Permission. */
export function useCan(...required: Permission[]): boolean {
  return hasPermissions(useCurrentUser(), ...required);
}

type CanProps = {
  /** Every Permission needed to see the children. */
  permission: Permission | Permission[];
  children: ReactNode;
  /** Rendered instead when a Permission is missing. */
  fallback?: ReactNode;
};

export function Can({ permission, children, fallback = null }: CanProps) {
  const allowed = useCan(
    ...(Array.isArray(permission) ? permission : [permission]),
  );
  return <>{allowed ? children : fallback}</>;
}
