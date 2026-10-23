import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, TIME_ZONE } from "./config";
import { formats } from "./formats";

export default getRequestConfig(async () => {
  const requested = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  return {
    locale,
    timeZone: TIME_ZONE,
    formats,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
