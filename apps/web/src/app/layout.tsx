import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { rubik } from "./fonts";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
