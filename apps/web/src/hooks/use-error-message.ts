"use client";

import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/api-error";

/**
 * A message for the User in their language. The API's own messages are
 * English and meant for developers, so only the status decides the text.
 */
export function useErrorMessage() {
  const t = useTranslations("errors");
  return (error: unknown): string => {
    if (!(error instanceof ApiError)) return t("network");
    if (error.status === 403) return t("forbidden");
    if (error.status === 404) return t("notFound");
    if (error.status === 429) return t("rateLimited");
    if (error.status >= 500) return t("server");
    return t("unexpected");
  };
}
