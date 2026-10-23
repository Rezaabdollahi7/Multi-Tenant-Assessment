"use client";

import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { DURATION, EASE_OUT } from "@/lib/motion";

export function useCountUp(
  target: number,
  format: (value: number) => string,
): MotionValue<string> {
  const value = useMotionValue(0);
  const text = useTransform(value, (current) => format(Math.round(current)));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      value.jump(target);
      return;
    }
    const controls = animate(value, target, {
      duration: DURATION.figure,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [target, value, reduceMotion]);

  return text;
}
