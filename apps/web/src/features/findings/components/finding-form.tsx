"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, type Ref } from "react";
import {
  Controller,
  useForm,
  type Path,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { toast } from "sonner";
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
import { useErrorMessage } from "@/hooks/use-error-message";
import { ApiError } from "@/lib/api/api-error";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { SEVERITIES } from "@/lib/severity";
import { FINDING_STATUSES } from "@/lib/status";
import {
  useCreateFinding,
  useProjectOptions,
  useUpdateFinding,
} from "../hooks/use-findings";
import {
  createFindingSchema,
  editFindingSchema,
  type CreateFindingForm,
  type EditFindingForm,
} from "../schemas";

/**
 * Puts the API's validation messages on their fields, and reports whether
 * any landed; whatever did not goes to the form-level alert.
 */
function placeServerErrors<Form extends Record<string, unknown>>(
  error: Error,
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
  defaultProjectId,
}: {
  /** Preselected when the User came from a Project. */
  defaultProjectId?: string;
}) {
  const t = useTranslations();
  const validation = useTranslations("findings.validation");
  const errorMessage = useErrorMessage();
  const router = useRouter();
  const projectOptions = useProjectOptions();
  const createFinding = useCreateFinding();
  const schema = useMemo(() => createFindingSchema(validation), [validation]);
  const form = useForm<CreateFindingForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: defaultProjectId ?? "",
      title: "",
      description: "",
      severity: undefined,
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    createFinding.mutate(values, {
      onSuccess: (finding) => {
        toast.success(t("findings.form.created"));
        router.push(routes.finding(finding.id));
      },
      onError: (error) => {
        const placed = placeServerErrors<CreateFindingForm>(
          error,
          ["projectId", "title", "description", "severity"],
          (field, message) => form.setError(field, { message }),
        );
        if (!placed) form.setError("root", { message: errorMessage(error) });
      },
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <FormErrorAlert message={errors.root?.message} />
      <FormField
        id="projectId"
        label={t("findings.form.project")}
        error={errors.projectId?.message}
      >
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
                  <SelectValue
                    placeholder={
                      projectOptions.isPending
                        ? t("findings.form.loadingProjects")
                        : t("findings.form.selectProject")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.data?.map((project) => (
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
      <FormField
        id="severity"
        label={t("findings.form.severity")}
        error={errors.severity?.message}
      >
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
                placeholder={t("findings.form.selectSeverity")}
                options={SEVERITIES}
                label={(severity) => t(`severity.${severity}`)}
              />
            )}
          />
        )}
      </FormField>
      <FormActions
        submitLabel={t("findings.form.submitCreate")}
        pending={createFinding.isPending}
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
  const t = useTranslations();
  const validation = useTranslations("findings.validation");
  const errorMessage = useErrorMessage();
  const router = useRouter();
  const updateFinding = useUpdateFinding(finding.id);
  const schema = useMemo(() => editFindingSchema(validation), [validation]);
  const form = useForm<EditFindingForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: finding.title,
      description: finding.description ?? "",
      severity: finding.severity,
      status: finding.status,
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    updateFinding.mutate(values, {
      onSuccess: () => {
        toast.success(t("findings.form.updated"));
        router.push(routes.finding(finding.id));
      },
      onError: (error) => {
        const placed = placeServerErrors<EditFindingForm>(
          error,
          ["title", "description", "severity", "status"],
          (field, message) => form.setError(field, { message }),
        );
        if (!placed) form.setError("root", { message: errorMessage(error) });
      },
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      <FormErrorAlert message={errors.root?.message} />
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("findings.form.project")}</p>
        <p className="text-sm text-muted-foreground">{finding.project.name}</p>
      </div>
      <TitleAndDescription
        titleProps={form.register("title")}
        descriptionProps={form.register("description")}
        titleError={errors.title?.message}
        descriptionError={errors.description?.message}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="severity"
          label={t("findings.form.severity")}
          error={errors.severity?.message}
        >
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
                  placeholder={t("findings.form.selectSeverity")}
                  options={SEVERITIES}
                  label={(severity) => t(`severity.${severity}`)}
                />
              )}
            />
          )}
        </FormField>
        <FormField
          id="status"
          label={t("findings.form.status")}
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
                  placeholder={t("findings.form.selectStatus")}
                  options={FINDING_STATUSES}
                  label={(status) => t(`findingStatus.${status}`)}
                />
              )}
            />
          )}
        </FormField>
      </div>
      <FormActions
        submitLabel={t("findings.form.submitEdit")}
        pending={updateFinding.isPending}
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
  const t = useTranslations("findings.form");
  return (
    <>
      <FormField
        id="title"
        label={t("title")}
        hint={t("titleHint")}
        error={titleError}
      >
        {(control) => <Input {...control} {...titleProps} />}
      </FormField>
      <FormField
        id="description"
        label={t("description")}
        hint={t("descriptionHint")}
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
  const t = useTranslations("common");
  return (
    <div className="flex gap-3">
      <Button type="submit" disabled={pending}>
        {pending && <Loader2Icon className="animate-spin" aria-hidden />}
        {submitLabel}
      </Button>
      <Button variant="outline" asChild>
        <Link href={cancelHref}>{t("cancel")}</Link>
      </Button>
    </div>
  );
}
