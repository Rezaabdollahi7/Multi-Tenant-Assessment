import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** The props a field's control needs to be labelled and to announce its error. */
export type FieldControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
};

type FormFieldProps = {
  id: string;
  label: string;
  /** Shown under the control and announced with it. */
  error?: string;
  /** Guidance shown under the label, e.g. a length limit. */
  hint?: string;
  children: (control: FieldControlProps) => ReactNode;
};

/** A labelled form control with its hint and validation error. */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children({
        id,
        "aria-invalid": error !== undefined,
        "aria-describedby": describedBy,
      })}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
