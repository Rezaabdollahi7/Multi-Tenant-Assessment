import { z } from "zod";
import { SEVERITIES } from "@/lib/severity";
import { FINDING_STATUSES } from "@/lib/status";

/** The Findings list's URL search params; invalid values fall back to defaults. */
export const findingListParamsSchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .transform((search) => search || undefined)
    .optional()
    .catch(undefined),
  severity: z.enum(SEVERITIES).optional().catch(undefined),
  status: z.enum(FINDING_STATUSES).optional().catch(undefined),
  projectId: z.uuid().optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});

export type FindingListParams = z.output<typeof findingListParamsSchema>;

/* Limits mirror CreateFindingDto and UpdateFindingDto in apps/api. */
const findingFields = {
  title: z
    .string()
    .trim()
    .min(3, "Enter at least 3 characters")
    .max(200, "Keep the title under 200 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Keep the description under 5,000 characters"),
  severity: z.enum(SEVERITIES, "Choose a Severity"),
};

export const createFindingSchema = z.object({
  ...findingFields,
  projectId: z.uuid("Choose a Project"),
});

export const editFindingSchema = z.object({
  ...findingFields,
  status: z.enum(FINDING_STATUSES, "Choose a Finding Status"),
});

export type CreateFindingForm = z.infer<typeof createFindingSchema>;
export type EditFindingForm = z.infer<typeof editFindingSchema>;
