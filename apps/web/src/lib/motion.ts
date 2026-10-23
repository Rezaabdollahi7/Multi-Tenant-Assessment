import type { CSSProperties } from "react";

/** The one easing for movement: quick out, soft landing. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Seconds; data animations finish before the eye has to wait for them. */
export const DURATION = {
  quick: 0.25,
  base: 0.6,
  figure: 1.1,
} as const;

/** Seconds between siblings that enter one after another. */
export const STAGGER = 0.05;

/** Delays a `.reveal` entrance by its position on the page. */
export function revealOrder(index: number): CSSProperties {
  return { "--reveal-index": index } as CSSProperties;
}
