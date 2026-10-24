"use client";

import { useState } from "react";
import { CodeStepForm } from "./code-step-form";
import { PhoneStepForm, type CodeStep } from "./phone-step-form";

type LoginFormProps = {
  next?: string;
  showDemoAccounts?: boolean;
};

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
