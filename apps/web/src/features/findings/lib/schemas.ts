import { z } from "zod";
import { SEVERITIES } from "@/lib/severity";
import { FINDING_STATUSES } from "@/lib/status";

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

const findingFields = {
  title: z
    .string()
    .trim()
    .min(3, "دست‌کم ۳ نویسه وارد کنید")
    .max(200, "عنوان باید کمتر از ۲۰۰ نویسه باشد"),
  description: z
    .string()
    .trim()
    .max(5000, "توضیحات باید کمتر از ۵٬۰۰۰ نویسه باشد"),
  severity: z.enum(SEVERITIES, "شدت را انتخاب کنید"),
};

export const createFindingSchema = z.object({
  ...findingFields,
  projectId: z.uuid("پروژه را انتخاب کنید"),
});

export const editFindingSchema = z.object({
  ...findingFields,
  status: z.enum(FINDING_STATUSES, "وضعیت یافته را انتخاب کنید"),
});

export type CreateFindingForm = z.infer<typeof createFindingSchema>;
export type EditFindingForm = z.infer<typeof editFindingSchema>;
