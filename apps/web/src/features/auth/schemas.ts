import { z } from "zod";

type Translate = (key: "phone" | "code") => string;

/** Iranian mobile numbers in their local form, as the seeded accounts use. */
export function phoneFormSchema(t: Translate) {
  return z.object({
    phone: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, t("phone")),
  });
}

export function codeFormSchema(t: Translate) {
  return z.object({
    code: z.string().regex(/^\d{5}$/, t("code")),
  });
}

export type PhoneForm = z.infer<ReturnType<typeof phoneFormSchema>>;
export type CodeForm = z.infer<ReturnType<typeof codeFormSchema>>;
