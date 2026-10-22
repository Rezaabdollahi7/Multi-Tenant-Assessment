import type { Metadata } from "next";
import type { ReactNode } from "react";
import { firaCode, firaSans } from "./fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Secure Assessment Dashboard",
    template: "%s · Secure Assessment Dashboard",
  },
  description:
    "Track security assessment projects and findings across organizations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // next-themes sets the theme class before hydration, so React must not warn.
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaSans.variable} ${firaCode.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
