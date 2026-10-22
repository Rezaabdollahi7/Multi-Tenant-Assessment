import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { SessionProvider } from "@/features/auth/components/session-provider";
import { routes } from "@/lib/routes";

/** Written by the sidebar primitive whenever it is opened or collapsed. */
const SIDEBAR_COOKIE = "sidebar_state";

/**
 * Every page in this group requires a session. proxy.ts has already renewed or
 * redirected; this is the authoritative check against the API.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login({ reason: "session_expired" }));

  const sidebarOpen = (await cookies()).get(SIDEBAR_COOKIE)?.value !== "false";

  return (
    <SessionProvider user={user}>
      <AppShell sidebarOpen={sidebarOpen}>{children}</AppShell>
    </SessionProvider>
  );
}
