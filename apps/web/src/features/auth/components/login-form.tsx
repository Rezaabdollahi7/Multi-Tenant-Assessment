"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useErrorMessage } from "@/hooks/use-error-message";
import { ApiError } from "@/lib/api/api-error";
import { safeNextPath } from "@/lib/routes";
import { requestOtp, verifyOtp } from "../api/auth-api";
import {
  codeFormSchema,
  phoneFormSchema,
  type CodeForm,
  type PhoneForm,
} from "../schemas";
import { DemoAccountsList } from "./demo-accounts-list";

const CODE_LENGTH = 5;

/** Phone numbers and codes read left to right inside Persian text. */
function LeftToRight(chunks: ReactNode) {
  return (
    <bdi dir="ltr" className="text-foreground tabular-nums">
      {chunks}
    </bdi>
  );
}

type LoginFormProps = {
  /** Where to go after signing in; validated against open redirects. */
  next?: string;
  showDemoAccounts?: boolean;
};

type CodeStep = { phone: string; demoCode?: string };

export function LoginForm({ next, showDemoAccounts = false }: LoginFormProps) {
  const [codeStep, setCodeStep] = useState<CodeStep | null>(null);

  return codeStep ? (
    <CodeStepForm
      {...codeStep}
      next={next}
      onChangePhone={() => setCodeStep(null)}
    />
  ) : (
    <PhoneStepForm
      showDemoAccounts={showDemoAccounts}
      onCodeSent={setCodeStep}
    />
  );
}

function PhoneStepForm({
  showDemoAccounts,
  onCodeSent,
}: {
  showDemoAccounts: boolean;
  onCodeSent: (step: CodeStep) => void;
}) {
  const t = useTranslations("auth");
  const errorMessage = useErrorMessage();
  const schema = useMemo(
    () => phoneFormSchema((key) => t(`validation.${key}`)),
    [t],
  );
  const form = useForm<PhoneForm>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "" },
  });
  const sendCode = useMutation({
    mutationFn: ({ phone }: PhoneForm) => requestOtp(phone),
    onSuccess: (result, { phone }) =>
      onCodeSent({ phone, demoCode: result.code }),
    onError: (error) => {
      const fieldError =
        error instanceof ApiError ? error.fieldErrors.phone?.[0] : undefined;
      if (fieldError) form.setError("phone", { message: fieldError });
    },
  });
  const phoneError = form.formState.errors.phone?.message;
  const formError =
    sendCode.isError &&
    !(sendCode.error instanceof ApiError && sendCode.error.fieldErrors.phone)
      ? errorMessage(sendCode.error)
      : null;

  return (
    <div className="space-y-6">
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => sendCode.mutate(values))}
        className="space-y-4"
      >
        {formError && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phoneLabel")}</Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="09121234567"
            aria-invalid={!!phoneError}
            aria-describedby={phoneError ? "phone-error" : undefined}
            {...form.register("phone")}
          />
          {phoneError && (
            <p id="phone-error" className="text-destructive text-sm">
              {phoneError}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={sendCode.isPending}>
          {sendCode.isPending && (
            <Loader2Icon className="animate-spin" aria-hidden />
          )}
          {t("sendCode")}
        </Button>
      </form>

      {showDemoAccounts && (
        <DemoAccountsList
          onSelect={(phone) => {
            form.setValue("phone", phone, { shouldValidate: true });
            form.setFocus("phone");
          }}
        />
      )}
    </div>
  );
}

function CodeStepForm({
  phone,
  demoCode,
  next,
  onChangePhone,
}: CodeStep & { next?: string; onChangePhone: () => void }) {
  const router = useRouter();
  const t = useTranslations("auth");
  const errorMessage = useErrorMessage();
  const schema = useMemo(
    () => codeFormSchema((key) => t(`validation.${key}`)),
    [t],
  );
  const form = useForm<CodeForm>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });
  const signIn = useMutation({
    mutationFn: ({ code }: CodeForm) => verifyOtp(phone, code),
    onSuccess: () => {
      router.replace(safeNextPath(next));
      router.refresh();
    },
    onError: (error) => {
      // A rejected code belongs to the field; throttling and outages to the form.
      if (error instanceof ApiError && error.status === 401) {
        form.setError("code", { message: t("wrongCode") });
        form.setValue("code", "");
      }
    },
  });
  const code = useWatch({ control: form.control, name: "code" });
  const codeError = form.formState.errors.code?.message;
  const formError =
    signIn.isError &&
    !(signIn.error instanceof ApiError && signIn.error.status === 401)
      ? errorMessage(signIn.error)
      : null;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => signIn.mutate(values))}
      className="space-y-4"
    >
      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="code">{t("codeLabel")}</Label>
        <p id="code-hint" className="text-muted-foreground text-sm">
          {t.rich("sentTo", { phone, ltr: LeftToRight })}
          {demoCode && (
            <>
              {" · "}
              {t.rich("demoCode", { code: demoCode, ltr: LeftToRight })}
            </>
          )}
        </p>
        {/* Digits are entered left to right in every language; the boxes
            still sit at the start of the line. */}
        <div dir="ltr" className="flex rtl:justify-end">
          <InputOTP
            id="code"
            maxLength={CODE_LENGTH}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(code) =>
              form.setValue("code", code, { shouldValidate: !!codeError })
            }
            onComplete={() =>
              form.handleSubmit((values) => signIn.mutate(values))()
            }
            aria-invalid={!!codeError}
            aria-describedby={codeError ? "code-hint code-error" : "code-hint"}
          >
            <InputOTPGroup>
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {codeError && (
          <p id="code-error" className="text-destructive text-sm">
            {codeError}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={signIn.isPending}>
        {signIn.isPending && (
          <Loader2Icon className="animate-spin" aria-hidden />
        )}
        {t("submit")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onChangePhone}
      >
        {t("differentNumber")}
      </Button>
    </form>
  );
}
