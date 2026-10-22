import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type SignInReason = "session_expired" | "signed_out";

const MESSAGES: Record<SignInReason, string> = {
  session_expired: "Your session has expired. Sign in again to continue.",
  signed_out: "You have been signed out.",
};

export function isSignInReason(value: unknown): value is SignInReason {
  return typeof value === "string" && value in MESSAGES;
}

/** Explains why the User landed on the sign-in page, when there is a reason. */
export function SignInNotice({ reason }: { reason: SignInReason }) {
  return (
    <Alert role="status">
      <InfoIcon aria-hidden />
      <AlertDescription>{MESSAGES[reason]}</AlertDescription>
    </Alert>
  );
}
