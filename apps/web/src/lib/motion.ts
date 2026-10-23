import type { CSSProperties } from "react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  quick: 0.25,
  base: 0.6,
  figure: 1.1,
} as const;

export const STAGGER = 0.05;

export function revealOrder(index: number): CSSProperties {
  return { "--reveal-index": index } as CSSProperties;
}
