"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Option } from "@/assets/types/common";
import { FormField } from "@/components/shared/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { errorMessage } from "@/lib/api/api-error";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { createFinding } from "../../lib/findings-mutations";
import { placeServerErrors } from "../../lib/place-server-errors";
import {
  createFindingSchema,
  type CreateFindingForm as CreateFindingFormValues,
} from "../../lib/schemas";
import { EnumSelect } from "../ui/enum-select";
import { FormActions } from "../ui/form-actions";
import { FormErrorAlert } from "../ui/form-error-alert";
import { TitleDescriptionFields } from "../ui/title-description-fields";

type CreateFindingFormProps = {
  projectOptions: Option[];
  defaultProjectId?: string;
};

export function CreateFindingForm({
  projectOptions,
  defaultProjectId,
}: CreateFindingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<CreateFindingFormValues>({
    resolver: zodResolver(createFindingSchema),
    defaultValues: {
      projectId: defaultProjectId ?? "",
      title: "",
      description: "",
      severity: undefined,
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      try {
        const finding = await createFinding(values);
        toast.success("یافته ثبت شد");
        router.push(routes.finding(finding.id));
      } catch (error) {
        const placed = placeServerErrors<CreateFindingFormValues>(
          error,
          ["projectId", "title", "description", "severity"],
          (field, message) => form.setError(field, { message }),
        );
        if (!placed) form.setError("root", { message: errorMessage(error) });
      }
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <FormErrorAlert message={errors.root?.message} />
      <FormField id="projectId" label="پروژه" error={errors.projectId?.message}>
        {(control) => (
          <Controller
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  {...control}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  className="w-full"
                >
                  <SelectValue placeholder="یک پروژه انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project.value} value={project.value}>
                      {project.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </FormField>
      <TitleDescriptionFields
        titleProps={form.register("title")}
        descriptionProps={form.register("description")}
        titleError={errors.title?.message}
        descriptionError={errors.description?.message}
      />
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
      <FormActions
        submitLabel="ثبت یافته"
        pending={pending}
        cancelHref={
          defaultProjectId
            ? routes.project(defaultProjectId)
            : routes.findings()
        }
      />
    </form>
  );
}
