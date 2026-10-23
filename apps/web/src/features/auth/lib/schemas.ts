import { z } from "zod";

export const phoneFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      /^09\d{9}$/,
      "شمارهٔ موبایل ۱۱ رقمی که با ۰۹ شروع می‌شود را وارد کنید",
    ),
});

export const codeFormSchema = z.object({
  code: z.string().regex(/^\d{5}$/, "کد ۵ رقمی را وارد کنید"),
});

export type PhoneForm = z.infer<typeof phoneFormSchema>;
export type CodeForm = z.infer<typeof codeFormSchema>;
