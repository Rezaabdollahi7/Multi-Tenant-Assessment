import type { ReactNode } from "react";
import { dana } from "@/assets/fonts";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${dana.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
