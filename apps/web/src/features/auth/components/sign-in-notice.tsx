import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SIGN_IN_REASONS = ["session_expired", "signed_out"] as const;
export type SignInReason = (typeof SIGN_IN_REASONS)[number];

export function isSignInReason(value: unknown): value is SignInReason {
  return SIGN_IN_REASONS.some((reason) => reason === value);
}

/** Explains why the User landed on the sign-in page, when there is a reason. */
export function SignInNotice({ reason }: { reason: SignInReason }) {
  const t = useTranslations("auth.reasons");
  return (
    <Alert role="status">
      <InfoIcon aria-hidden />
      <AlertDescription>{t(reason)}</AlertDescription>
    </Alert>
  );
}
