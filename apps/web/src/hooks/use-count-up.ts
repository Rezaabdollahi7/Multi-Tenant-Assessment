"use client";

import { useMemo } from "react";

export function useCountUp(
  target: number,
  format: (value: number) => string,
): string {
  return useMemo(() => format(target), [target, format]);
}
