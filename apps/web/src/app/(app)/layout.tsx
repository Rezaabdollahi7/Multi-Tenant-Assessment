import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { SessionProvider } from "@/features/auth/components/session-provider";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
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
      <div className="flex min-h-svh flex-col">
        <header className="border-border bg-card flex items-center justify-between border-b px-4 py-2">
          <p className="text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground">
              {" "}
              · {user.organization.name}
            </span>
          </p>
          <SignOutButton />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </SessionProvider>
  );
}
