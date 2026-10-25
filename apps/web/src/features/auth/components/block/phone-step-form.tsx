"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, errorMessage } from "@/lib/api/api-error";
import { requestOtp } from "../../lib/auth-api";
import { phoneFormSchema, type PhoneForm } from "../../lib/schemas";
import { DemoAccountsList } from "../ui/demo-accounts-list";

export type CodeStep = { phone: string; demoCode?: string };

type PhoneStepFormProps = {
  showDemoAccounts: boolean;
  onCodeSent: (step: CodeStep) => void;
};

export function PhoneStepForm({
  showDemoAccounts,
  onCodeSent,
}: PhoneStepFormProps) {
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
