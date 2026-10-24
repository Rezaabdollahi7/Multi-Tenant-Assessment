"use client";

import { ThemeProvider } from "next-themes";
import { Direction } from "radix-ui";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Direction.Provider dir="rtl">
        {children}
        <Toaster richColors closeButton dir="rtl" />
      </Direction.Provider>
    </ThemeProvider>
  );
}
