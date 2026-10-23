import type messages from "./messages/en.json";
import type { AppLocale } from "./config";
import type { formats } from "./formats";

/** Types every translation key and named format against the English messages. */
declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
