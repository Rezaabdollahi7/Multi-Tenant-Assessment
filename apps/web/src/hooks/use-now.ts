"use client";

import { useEffect, useState } from "react";

const ONE_MINUTE = 60_000;

/** Client-only current time, updated every minute (null until mounted). */
export function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, ONE_MINUTE);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return now;
}
