import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

type AppShellProps = {
  children: ReactNode;
  /** Restored from the sidebar's cookie so the first render matches the last visit. */
  sidebarOpen: boolean;
};

export function AppShell({ children, sidebarOpen }: AppShellProps) {
  const t = useTranslations("common");
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:start-2 focus:top-2"
      >
        {t("skipToContent")}
      </a>
      <AppSidebar />
      {/* SidebarInset renders the page's single <main> landmark. */}
      <SidebarInset id="main-content" tabIndex={-1}>
        <header className="bg-background/95 sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ms-1" />
          <div className="ms-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
