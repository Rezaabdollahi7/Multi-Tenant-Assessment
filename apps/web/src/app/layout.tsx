import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dana } from "@/assets/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "داشبورد ارزیابی امنیت",
    template: "%s · داشبورد ارزیابی امنیت",
  },
  description: "پیگیری پروژه‌های ارزیابی امنیت و یافته‌های آن‌ها در سازمان‌ها.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${dana.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
