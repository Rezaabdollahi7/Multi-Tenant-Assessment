import { InfoIcon } from "lucide-react";
import type { SignInReason } from "@/assets/types/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SIGN_IN_MESSAGES: Record<SignInReason, string> = {
  session_expired: "نشست شما منقضی شده است. برای ادامه دوباره وارد شوید.",
  signed_out: "از حساب خود خارج شدید.",
};

export function isSignInReason(value: unknown): value is SignInReason {
  return Object.keys(SIGN_IN_MESSAGES).some((reason) => reason === value);
}

export function SignInNotice({ reason }: { reason: SignInReason }) {
  return (
    <Alert role="status">
      <InfoIcon aria-hidden />
      <AlertDescription>{SIGN_IN_MESSAGES[reason]}</AlertDescription>
    </Alert>
  );
}
