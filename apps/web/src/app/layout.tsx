import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { LOCALE_DIRECTIONS } from "@/i18n/config";
import { dana } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: {
      default: t("common.appName"),
      template: `%s · ${t("common.appName")}`,
    },
    description: t("metadata.description"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const direction = LOCALE_DIRECTIONS[locale];

  return (
    // next-themes sets the theme class before hydration, so React must not warn.
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${dana.variable} antialiased`}>
        <NextIntlClientProvider>
          <Providers direction={direction}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
