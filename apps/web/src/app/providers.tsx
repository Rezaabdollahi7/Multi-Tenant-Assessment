"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Direction } from "radix-ui";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createQueryClient } from "@/lib/query-client";

type ProvidersProps = {
  /** Mirrors <html dir>; Radix menus and selects read it to open the right way. */
  direction: "rtl" | "ltr";
  children: ReactNode;
};

export function Providers({ direction, children }: ProvidersProps) {
  // One client per browser session; created lazily so the server never shares it.
  const [queryClient] = useState(createQueryClient);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Direction.Provider dir={direction}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster richColors closeButton dir={direction} />
        </QueryClientProvider>
      </Direction.Provider>
    </ThemeProvider>
  );
}
