"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShellButton } from "./shell-button";
import { applyThemeWithSpread } from "./theme-spread";

const THEMES = [
  { value: "light", label: "روشن", icon: SunIcon },
  { value: "dark", label: "تیره", icon: MoonIcon },
  { value: "system", label: "هماهنگ با سیستم", icon: MonitorIcon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ShellButton ref={triggerRef} aria-label="تغییر پوسته">
          <SunIcon className="dark:hidden" aria-hidden />
          <MoonIcon className="hidden dark:block" aria-hidden />
        </ShellButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>پوسته</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) =>
            applyThemeWithSpread(triggerRef.current, value, setTheme)
          }
        >
          {THEMES.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon aria-hidden />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
