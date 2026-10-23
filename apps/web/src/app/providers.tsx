"use client";

import { MotionConfig } from "motion/react";
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
        <MotionConfig reducedMotion="user">
          {children}
          <Toaster richColors closeButton dir="rtl" />
        </MotionConfig>
      </Direction.Provider>
    </ThemeProvider>
  );
}
