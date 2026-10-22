import { ShieldCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/features/auth/api/get-current-user";
import { LoginForm } from "@/features/auth/components/login-form";
import {
  isSignInReason,
  SignInNotice,
} from "@/features/auth/components/sign-in-notice";
import { safeNextPath } from "@/lib/routes";

export const metadata: Metadata = { title: "Sign in" };

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, reason } = await searchParams;
  if (await getCurrentUser()) redirect(safeNextPath(next));

  // Seeded demo accounts are listed only in development or when asked for.
  const showDemoAccounts =
    process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true";

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-primary flex items-center justify-center gap-2">
          <ShieldCheckIcon className="size-6" aria-hidden />
          <span className="text-foreground font-semibold">
            Secure Assessment Dashboard
          </span>
        </div>
        {isSignInReason(reason) && <SignInNotice reason={reason} />}
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Sign in</h1>
            </CardTitle>
            <CardDescription>
              We will text a one-time code to your mobile number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm next={next} showDemoAccounts={showDemoAccounts} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
