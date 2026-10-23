import { z } from "zod";
import { PROJECT_STATUSES } from "@/lib/status";

export const projectListParamsSchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .transform((search) => search || undefined)
    .optional()
    .catch(undefined),
  status: z.enum(PROJECT_STATUSES).optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});

export type ProjectListParams = z.output<typeof projectListParamsSchema>;
