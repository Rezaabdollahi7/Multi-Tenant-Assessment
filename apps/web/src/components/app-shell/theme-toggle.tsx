"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { flushSync } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShellButton } from "./shell-button";

const THEMES = [
  { value: "light", label: "روشن", icon: SunIcon },
  { value: "dark", label: "تیره", icon: MoonIcon },
  { value: "system", label: "هماهنگ با سیستم", icon: MonitorIcon },
] as const;

/** Milliseconds for the new theme to spread over the page. */
const SPREAD_DURATION = 550;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  /**
   * The new theme grows out of the button as a circle, where the browser can
   * snapshot the page (View Transitions); elsewhere, or with reduced motion,
   * it simply switches.
   */
  function changeTheme(value: string) {
    const button = triggerRef.current;
    if (!document.startViewTransition || reduceMotion || !button) {
      setTheme(value);
      return;
    }
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    // next-themes sets the class in an effect; a synchronous update runs its
    // effects before returning, so the browser snapshots the new theme.
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(value));
    });
    void transition.ready.then(() =>
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: SPREAD_DURATION,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ),
    );
  }

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
        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
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
