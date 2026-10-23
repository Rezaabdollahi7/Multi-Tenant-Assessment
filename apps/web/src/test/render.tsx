import { QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import { TIME_ZONE, type AppLocale } from "@/i18n/config";
import { formats } from "@/i18n/formats";
import en from "@/i18n/messages/en.json";
import fa from "@/i18n/messages/fa.json";
import { createQueryClient } from "@/lib/query-client";

const MESSAGES = { en, fa };

type ProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  /** Tests read in English unless they are about Persian. */
  locale?: AppLocale;
};

/** Renders with a fresh QueryClient and translations, as the app's providers would. */
export function renderWithProviders(
  ui: ReactElement,
  { locale = "en", ...options }: ProvidersOptions = {},
) {
  const queryClient = createQueryClient();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone={TIME_ZONE}
        formats={formats}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextIntlClientProvider>
    );
  }
  return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) };
}
