"use client";

import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLocale } from "@/i18n/actions";
import { isLocale, LOCALES } from "@/i18n/config";

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(value: string) {
    if (!isLocale(value) || value === locale) return;
    startTransition(async () => {
      await setLocale(value);
      // Server Components re-render in the new language; client state survives.
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("change")}
          disabled={pending}
        >
          <LanguagesIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={choose}>
          {LOCALES.map((value) => (
            // Each language is named in itself, so it is findable from either.
            <DropdownMenuRadioItem key={value} value={value} lang={value}>
              {t(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
