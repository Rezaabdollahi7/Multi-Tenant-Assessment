"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Ref } from "react";
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
import { ApiError } from "@/lib/api/api-error";
import type { Finding } from "@/lib/api/types";
import { routes } from "@/lib/routes";
import { SEVERITIES, SEVERITY_LABELS } from "@/lib/severity";
import { FINDING_STATUSES, FINDING_STATUS_LABELS } from "@/lib/status";
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

const UNEXPECTED_ERROR =
  "Something went wrong. Check your connection and try again.";

/**
 * Puts the API's validation messages on their fields and returns whatever
 * cannot be shown on a field, for the form-level alert.
 */
function applyServerErrors<Form extends Record<string, unknown>>(
  error: Error,
  fields: readonly Path<Form>[],
  setFieldError: (field: Path<Form>, message: string) => void,
): string | null {
  if (!(error instanceof ApiError)) return UNEXPECTED_ERROR;
  let placedOnField = false;
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) {
      setFieldError(field, message);
      placedOnField = true;
    }
  }
  return placedOnField ? null : error.message;
}

export function CreateFindingForm({
  defaultProjectId,
}: {
  /** Preselected when the User came from a Project. */
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const projectOptions = useProjectOptions();
  const createFinding = useCreateFinding();
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
    createFinding.mutate(values, {
      onSuccess: (finding) => {
        toast.success("Finding reported");
        router.push(routes.finding(finding.id));
      },
      onError: (error) => {
        const formError = applyServerErrors<CreateFindingForm>(
          error,
          ["projectId", "title", "description", "severity"],
          (field, message) => form.setError(field, { message }),
        );
        if (formError) form.setError("root", { message: formError });
      },
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <FormErrorAlert message={errors.root?.message} />
      <FormField
        id="projectId"
        label="Project"
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
                        ? "Loading Projects…"
                        : "Select a Project"
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
        label="Severity"
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
                placeholder="Select a Severity"
                options={SEVERITIES}
                labels={SEVERITY_LABELS}
              />
            )}
          />
        )}
      </FormField>
      <FormActions
        submitLabel="Report Finding"
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
  const router = useRouter();
  const updateFinding = useUpdateFinding(finding.id);
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
    updateFinding.mutate(values, {
      onSuccess: () => {
        toast.success("Finding updated");
        router.push(routes.finding(finding.id));
      },
      onError: (error) => {
        const formError = applyServerErrors<EditFindingForm>(
          error,
          ["title", "description", "severity", "status"],
          (field, message) => form.setError(field, { message }),
        );
        if (formError) form.setError("root", { message: formError });
      },
    }),
  );

  return (
    <form noValidate onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <FormErrorAlert message={errors.root?.message} />
      <div className="space-y-2">
        <p className="text-sm font-medium">Project</p>
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
          label="Severity"
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
                  placeholder="Select a Severity"
                  options={SEVERITIES}
                  labels={SEVERITY_LABELS}
                />
              )}
            />
          )}
        </FormField>
        <FormField
          id="status"
          label="Finding Status"
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
                  placeholder="Select a Finding Status"
                  options={FINDING_STATUSES}
                  labels={FINDING_STATUS_LABELS}
                />
              )}
            />
          )}
        </FormField>
      </div>
      <FormActions
        submitLabel="Save changes"
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
  return (
    <>
      <FormField
        id="title"
        label="Title"
        hint="3 to 200 characters"
        error={titleError}
      >
        {(control) => <Input {...control} {...titleProps} />}
      </FormField>
      <FormField
        id="description"
        label="Description"
        hint="Optional. What is affected, how to reproduce it, and its impact."
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
  labels,
}: {
  ref: Ref<HTMLButtonElement>;
  control: FieldControlProps;
  value: Value | undefined;
  onChange: (value: Value) => void;
  onBlur: () => void;
  placeholder: string;
  options: readonly Value[];
  labels: Record<Value, string>;
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
            {labels[option]}
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
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}
