import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { SessionProvider } from "@/lib/session/session-provider";
import { routes } from "@/lib/routes";

/**
 * Every page in this group requires a session. proxy.ts has already renewed or
 * redirected; this is the authoritative check against the API.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login({ reason: "session_expired" }));

  return (
    <SessionProvider user={user}>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
