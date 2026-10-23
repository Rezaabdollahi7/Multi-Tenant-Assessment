/** The UI languages; Persian is the default (ADR 0007). */
export const LOCALES = ["fa", "en"] as const;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "fa";

/** The language lives in a cookie, not the URL: every page is behind sign-in. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_DIRECTIONS: Record<AppLocale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

/**
 * Dates render in one fixed zone on the server and in the browser, so the
 * HTML the server sends matches what React renders after hydration.
 */
export const TIME_ZONE = "Asia/Tehran";

export function isLocale(value: unknown): value is AppLocale {
  return LOCALES.some((locale) => locale === value);
}
