"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { ApiError, errorMessage } from "@/lib/api/api-error";
import { safeNextPath } from "@/lib/routes";
import { verifyOtp } from "../../lib/auth-api";
import { codeFormSchema, type CodeForm } from "../../lib/schemas";
import { LeftToRight } from "../ui/left-to-right";
import type { CodeStep } from "./phone-step-form";
import { P } from "@/components/shared/typography";

const CODE_LENGTH = 5;

type CodeStepFormProps = CodeStep & {
  next?: string;
  onChangePhone: () => void;
};

export function CodeStepForm({
  phone,
  demoCode,
  next,
  onChangePhone,
}: CodeStepFormProps) {
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
        <P id="code-hint" className="text-muted-foreground text-sm">
          ارسال‌شده به <LeftToRight>{phone}</LeftToRight>
          {demoCode && (
            <>
              کد دمو: <LeftToRight>{demoCode}</LeftToRight>
            </>
          )}
        </P>
        <div dir="ltr" className="flex justify-end">
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
