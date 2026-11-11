"use client";

import { useEffect, useState } from "react";

/** Keep ticking from the server's time even if an attendee's device clock is wrong. */
export function useEventClock(initialNow: number, intervalMs: number) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const mountedAt = performance.now();
    const update = () => setNow(initialNow + performance.now() - mountedAt);
    const timer = window.setInterval(update, intervalMs);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [initialNow, intervalMs]);
  return now;
}
