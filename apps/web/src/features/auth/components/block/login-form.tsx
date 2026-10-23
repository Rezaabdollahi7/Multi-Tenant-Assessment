"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { ApiError, errorMessage } from "@/lib/api/api-error";
import { safeNextPath } from "@/lib/routes";
import { requestOtp, verifyOtp } from "../../lib/auth-api";
import {
  codeFormSchema,
  phoneFormSchema,
  type CodeForm,
  type PhoneForm,
} from "../../lib/schemas";
import { DemoAccountsList } from "../ui/demo-accounts-list";

const CODE_LENGTH = 5;

type LoginFormProps = {
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
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<PhoneForm>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phone: "" },
  });
  const phoneError = form.formState.errors.phone?.message;

  const sendCode = form.handleSubmit(({ phone }) =>
    startTransition(async () => {
      setFormError(null);
      try {
        const result = await requestOtp(phone);
        onCodeSent({ phone, demoCode: result.code });
      } catch (error) {
        const fieldError =
          error instanceof ApiError ? error.fieldErrors.phone?.[0] : undefined;
        if (fieldError) form.setError("phone", { message: fieldError });
        else setFormError(errorMessage(error));
      }
    }),
  );

  return (
    <div className="space-y-6">
      <form noValidate onSubmit={sendCode} className="space-y-4">
        {formError && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="phone">شمارهٔ موبایل</Label>
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
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" aria-hidden />}
          ارسال کد
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
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<CodeForm>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: { code: "" },
  });
  const code = useWatch({ control: form.control, name: "code" });
  const codeError = form.formState.errors.code?.message;

  const signIn = form.handleSubmit(({ code }) =>
    startTransition(async () => {
      setFormError(null);
      try {
        await verifyOtp(phone, code);
        router.replace(safeNextPath(next));
        router.refresh();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          form.setError("code", { message: "کد اشتباه است یا منقضی شده است." });
          form.setValue("code", "");
        } else {
          setFormError(errorMessage(error));
        }
      }
    }),
  );

  return (
    <form noValidate onSubmit={signIn} className="space-y-4">
      {formError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="code">کد تأیید</Label>
        <p id="code-hint" className="text-muted-foreground text-sm">
          ارسال‌شده به <LeftToRight>{phone}</LeftToRight>
          {demoCode && (
            <>
              {" · "}
              کد دمو: <LeftToRight>{demoCode}</LeftToRight>
            </>
          )}
        </p>
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
            onComplete={() => signIn()}
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
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        ورود
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onChangePhone}
      >
        استفاده از شمارهٔ دیگر
      </Button>
    </form>
  );
}

function LeftToRight({ children }: { children: string }) {
  return (
    <bdi dir="ltr" className="text-foreground tabular-nums">
      {children}
    </bdi>
  );
}
