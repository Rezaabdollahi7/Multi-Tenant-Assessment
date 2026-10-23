"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE, type AppLocale } from "./config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Remembers the chosen language; the caller refreshes so the server re-renders in it. */
export async function setLocale(locale: AppLocale) {
  if (!isLocale(locale))
    throw new Error(`Unsupported locale: ${String(locale)}`);
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
}
