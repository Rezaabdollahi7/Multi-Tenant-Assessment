import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { routes } from "@/lib/routes";
import { SessionProvider } from "@/lib/session/session-provider";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login({ reason: "session_expired" }));

  return (
    <SessionProvider user={user}>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  );
}
