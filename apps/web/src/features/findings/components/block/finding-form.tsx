"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type Ref } from "react";
import {
  Controller,
  useForm,
  type Path,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { toast } from "sonner";
import type { Option } from "@/assets/types/common";
import type { Finding } from "@/assets/types/finding";
import {
  FormField,
  type FieldControlProps,
} from "@/components/shared/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, errorMessage } from "@/lib/api/api-error";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
import { createFinding, updateFinding } from "../../lib/findings-mutations";
import {
  createFindingSchema,
  editFindingSchema,
  type CreateFindingForm,
  type EditFindingForm,
} from "../../lib/schemas";

function placeServerErrors<Form extends Record<string, unknown>>(
  error: unknown,
  fields: readonly Path<Form>[],
  setFieldError: (field: Path<Form>, message: string) => void,
): boolean {
  if (!(error instanceof ApiError)) return false;
  let placed = false;
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) {
      setFieldError(field, message);
      placed = true;
    }
  }
  return placed;
}

export function CreateFindingForm({
  projectOptions,
  defaultProjectId,
}: {
  projectOptions: Option[];
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<CreateFindingForm>({
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
        const placed = placeServerErrors<CreateFindingForm>(
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
      <TitleAndDescription
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

export function EditFindingForm({ finding }: { finding: Finding }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<EditFindingForm>({
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
        const placed = placeServerErrors<EditFindingForm>(
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
      <TitleAndDescription
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

function FormErrorAlert({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <Alert variant="destructive" role="alert">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function TitleAndDescription({
  titleProps,
  descriptionProps,
  titleError,
  descriptionError,
}: {
  titleProps: UseFormRegisterReturn;
  descriptionProps: UseFormRegisterReturn;
  titleError: string | undefined;
  descriptionError: string | undefined;
}) {
  return (
    <>
      <FormField
        id="title"
        label="عنوان"
        hint="۳ تا ۲۰۰ نویسه"
        error={titleError}
      >
        {(control) => <Input {...control} {...titleProps} />}
      </FormField>
      <FormField
        id="description"
        label="توضیحات"
        hint="اختیاری. چه چیزی آسیب دیده، چطور بازتولید می‌شود و چه اثری دارد."
        error={descriptionError}
      >
        {(control) => <Textarea rows={8} {...control} {...descriptionProps} />}
      </FormField>
    </>
  );
}

function EnumSelect<Value extends string>({
  ref,
  control,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  label,
}: {
  ref: Ref<HTMLButtonElement>;
  control: FieldControlProps;
  value: Value | undefined;
  onChange: (value: Value) => void;
  onBlur: () => void;
  placeholder: string;
  options: readonly Value[];
  label: (option: Value) => string;
}) {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(selected) => {
        const option = options.find((candidate) => candidate === selected);
        if (option) onChange(option);
      }}
    >
      <SelectTrigger {...control} ref={ref} onBlur={onBlur} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {label(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FormActions({
  submitLabel,
  pending,
  cancelHref,
}: {
  submitLabel: string;
  pending: boolean;
  cancelHref: string;
}) {
  return (
    <div className="flex gap-3">
      <Button type="submit" disabled={pending}>
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        {submitLabel}
      </Button>
      <Button variant="outline" asChild>
        <Link href={cancelHref}>انصراف</Link>
      </Button>
    </div>
  );
}
