import { z } from "zod";

/** Iranian mobile numbers in their local form, as the seeded accounts use. */
export const phoneFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "Enter an 11-digit mobile number starting with 09"),
});

export const codeFormSchema = z.object({
  code: z.string().regex(/^\d{5}$/, "Enter the 5-digit code"),
});

export type PhoneForm = z.infer<typeof phoneFormSchema>;
export type CodeForm = z.infer<typeof codeFormSchema>;
