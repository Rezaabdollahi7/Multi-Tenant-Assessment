"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Finding } from "@/assets/types/finding";
import { FormField } from "@/components/shared/form-field";
import { errorMessage } from "@/lib/api/api-error";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
import { updateFinding } from "../../lib/findings-mutations";
import { placeServerErrors } from "../../lib/place-server-errors";
import {
  editFindingSchema,
  type EditFindingForm as EditFindingFormValues,
} from "../../lib/schemas";
import { EnumSelect } from "../ui/enum-select";
import { FormActions } from "../ui/form-actions";
import { FormErrorAlert } from "../ui/form-error-alert";
import { TitleDescriptionFields } from "../ui/title-description-fields";

export function EditFindingForm({ finding }: { finding: Finding }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<EditFindingFormValues>({
    resolver: zodResolver(editFindingSchema),
    defaultValues: {
      title: finding.title,
      description: finding.description ?? "",
      severity: finding.severity,
      status: finding.status,
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      try {
        await updateFinding(finding.id, values);
        toast.success("یافته به‌روزرسانی شد");
        router.push(routes.finding(finding.id));
      } catch (error) {
        const placed = placeServerErrors<EditFindingFormValues>(
          error,
          ["title", "description", "severity", "status"],
          (field, message) => form.setError(field, { message }),
        );
        if (!placed) form.setError("root", { message: errorMessage(error) });
      }
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <FormErrorAlert message={errors.root?.message} />
      <div className="space-y-2">
        <p className="text-sm font-medium">پروژه</p>
        <p className="text-sm text-muted-foreground">{finding.project.name}</p>
      </div>
      <TitleDescriptionFields
        titleProps={form.register("title")}
        descriptionProps={form.register("description")}
        titleError={errors.title?.message}
        descriptionError={errors.description?.message}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="severity" label="شدت" error={errors.severity?.message}>
          {(control) => (
            <Controller
              control={form.control}
              name="severity"
              render={({ field }) => (
                <EnumSelect
                  ref={field.ref}
                  control={control}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="یک شدت انتخاب کنید"
                  options={SEVERITIES}
                  label={(severity) => SEVERITY_LABELS[severity]}
                />
              )}
            />
          )}
        </FormField>
        <FormField
          id="status"
          label="وضعیت یافته"
          error={errors.status?.message}
        >
          {(control) => (
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <EnumSelect
                  ref={field.ref}
                  control={control}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="یک وضعیت انتخاب کنید"
                  options={FINDING_STATUSES}
                  label={(status) => FINDING_STATUS_LABELS[status]}
                />
              )}
            />
          )}
        </FormField>
      </div>
      <FormActions
        submitLabel="ذخیرهٔ تغییرات"
        pending={pending}
        cancelHref={routes.finding(finding.id)}
      />
    </form>
  );
}
