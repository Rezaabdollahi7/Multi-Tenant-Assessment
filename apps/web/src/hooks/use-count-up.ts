"use client";

import {
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * A figure that counts up to `target` when it arrives or changes, continuing
 * from where it last was, as text ready to render in a `motion` element. It
 * updates outside React, so counting does not re-render the component.
 * Callers render the plain figure instead when motion is reduced.
 */
export function useCountUp(
  target: number,
  format: (value: number) => string,
): MotionValue<string> {
  const value = useMotionValue(0);
  const text = useTransform(value, (current) => format(Math.round(current)));

  useEffect(() => {
    const controls = animate(value, target, {
      duration: DURATION.figure,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [target, value]);

  return text;
}
