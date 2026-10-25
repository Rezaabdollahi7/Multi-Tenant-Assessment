import { ShieldCheckIcon } from "lucide-react";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1 } from "@/components/shared/typography";
import { LoginForm } from "@/features/auth/components/block/login-form";
import {
  isSignInReason,
  SignInNotice,
} from "@/features/auth/components/ui/sign-in-notice";
import { getCurrentUser } from "@/features/auth/lib/get-current-user";
import { safeNextPath } from "@/lib/routes";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function page({ searchParams }: LoginPageProps) {
  const { next, reason } = await searchParams;
  if (await getCurrentUser()) redirect(safeNextPath(next));

  const showDemoAccounts =
    process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true";

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <span className="flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-base font-medium">
            <ShieldCheckIcon className="size-5" aria-hidden />
            داشبورد ارزیابی امنیت
          </span>
        </div>
        {isSignInReason(reason) && <SignInNotice reason={reason} />}
        <Card className="gap-8 rounded-3xl px-2 py-8 sm:px-4">
          <CardHeader className="gap-3">
            <CardTitle>
              <H1 className="text-display font-light">ورود</H1>
            </CardTitle>
            <CardDescription>
              یک کد یک‌بارمصرف به شمارهٔ موبایل شما پیامک می‌کنیم.
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
