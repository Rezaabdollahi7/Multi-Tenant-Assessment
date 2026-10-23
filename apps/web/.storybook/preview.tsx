import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { MotionConfig } from "motion/react";
import { NextIntlClientProvider } from "next-intl";
import { Direction } from "radix-ui";
import { dana } from "../src/app/fonts";
import {
  isLocale,
  LOCALE_DIRECTIONS,
  TIME_ZONE,
  type AppLocale,
} from "../src/i18n/config";
import { formats } from "../src/i18n/formats";
import en from "../src/i18n/messages/en.json";
import fa from "../src/i18n/messages/fa.json";
import "../src/app/globals.css";

const MESSAGES = { fa, en };

// Portalled content (menus, dialogs) renders in <body>, so the font goes there.
document.body.classList.add(dana.variable, "antialiased");

/** The theme chosen in the toolbar, applied the way next-themes does in the app. */
const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  return <Story />;
};

/** Messages, formats and direction for the language chosen in the toolbar, as the root layout sets them. */
const withLocale: Decorator = (Story, context) => {
  const requested: unknown = context.globals.locale;
  const locale: AppLocale = isLocale(requested) ? requested : "fa";
  const direction = LOCALE_DIRECTIONS[locale];
  // A docs page is written in English; only the stories on it follow the toolbar.
  const inDocs = context.viewMode === "docs";
  document.documentElement.lang = inDocs ? "en" : locale;
  document.documentElement.dir = inDocs ? "ltr" : direction;
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={MESSAGES[locale]}
      timeZone={TIME_ZONE}
      formats={formats}
    >
      <Direction.Provider dir={direction}>
        <MotionConfig reducedMotion="user">
          {/* On a docs page the app's background goes behind each story, so glass and dark mode read as in the app. */}
          <div
            lang={locale}
            dir={direction}
            className={
              inDocs
                ? "rounded-xl bg-background p-6 text-foreground"
                : undefined
            }
          >
            <Story />
          </div>
        </MotionConfig>
      </Direction.Provider>
    </NextIntlClientProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme, withLocale],
  globalTypes: {
    locale: {
      description: "Language",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [
          { value: "fa", title: "فارسی" },
          { value: "en", title: "English" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: "fa", theme: "light" },
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: { appDirectory: true },
    // Accessibility violations fail the story's test, not just warn in the panel.
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
