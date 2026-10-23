import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";
import { LanguageToggle } from "./language-toggle";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/** The page frame: a floating top bar with the brand, navigation and the User's controls. */
export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  return (
    <div className="min-h-svh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("skipToContent")}
      </a>
      <header className="sticky top-0 z-30 px-4 pt-4 md:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3">
          <BrandMark />
          <MainNav className="order-last w-full md:order-none md:mx-auto md:w-auto" />
          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-[1440px] px-4 pt-8 pb-16 outline-none md:px-8"
      >
        {children}
      </main>
    </div>
  );
}
