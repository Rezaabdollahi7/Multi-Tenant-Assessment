import { flushSync } from "react-dom";

const SPREAD_DURATION = 550;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Applies the theme change with a circular view-transition from the trigger,
 * or falls back to a plain setTheme when transitions are unavailable/disabled.
 */
export function applyThemeWithSpread(
  button: HTMLElement | null,
  value: string,
  setTheme: (value: string) => void,
): void {
  if (!document.startViewTransition || prefersReducedMotion() || !button) {
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
