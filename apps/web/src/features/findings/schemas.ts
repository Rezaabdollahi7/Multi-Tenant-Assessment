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

type ValidationKey =
  | "titleTooShort"
  | "titleTooLong"
  | "descriptionTooLong"
  | "chooseProject"
  | "chooseSeverity"
  | "chooseStatus";

/** Messages come from the caller's translator, so errors read in the UI language. */
type Translate = (key: ValidationKey) => string;

/* Limits mirror CreateFindingDto and UpdateFindingDto in apps/api. */
function findingFields(t: Translate) {
  return {
    title: z
      .string()
      .trim()
      .min(3, t("titleTooShort"))
      .max(200, t("titleTooLong")),
    description: z.string().trim().max(5000, t("descriptionTooLong")),
    severity: z.enum(SEVERITIES, t("chooseSeverity")),
  };
}

export function createFindingSchema(t: Translate) {
  return z.object({
    ...findingFields(t),
    projectId: z.uuid(t("chooseProject")),
  });
}

export function editFindingSchema(t: Translate) {
  return z.object({
    ...findingFields(t),
    status: z.enum(FINDING_STATUSES, t("chooseStatus")),
  });
}

export type CreateFindingForm = z.infer<ReturnType<typeof createFindingSchema>>;
export type EditFindingForm = z.infer<ReturnType<typeof editFindingSchema>>;
