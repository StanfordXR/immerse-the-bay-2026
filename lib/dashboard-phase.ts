/** Event milestones as epoch milliseconds. */
export interface EventTimeline {
  opening: number;
  hackingStart: number;
  hackingEnd: number;
  closing: number;
}

/** Where the event is right now; drives the live dashboard's hero. */
export type DashboardPhase =
  | { id: "before"; target: number }
  | { id: "opening"; target: number }
  | { id: "hacking"; target: number; progress: number; finalStretch: boolean }
  | { id: "wrap-up"; target: number }
  | { id: "after" };

/** The last stretch before submissions close, when the hero pushes Submit. */
export const FINAL_STRETCH_MS = 3 * 60 * 60 * 1000;

/** How long after the closing ceremony starts the hero switches to "that's a wrap". */
const CLOSING_LENGTH_MS = 2 * 60 * 60 * 1000;

export function dashboardPhase(timeline: EventTimeline, now: number): DashboardPhase {
  const { opening, hackingStart, hackingEnd, closing } = timeline;
  if (now < opening) return { id: "before", target: opening };
  if (now < hackingStart) return { id: "opening", target: hackingStart };
  if (now < hackingEnd) {
    return {
      id: "hacking",
      target: hackingEnd,
      progress: (now - hackingStart) / (hackingEnd - hackingStart),
      finalStretch: hackingEnd - now <= FINAL_STRETCH_MS,
    };
  }
  if (now < closing + CLOSING_LENGTH_MS) return { id: "wrap-up", target: closing };
  return { id: "after" };
}

/** Splits a duration into countdown units; days are dropped once under a day. */
export function countdownParts(ms: number): Array<{ value: number; label: string }> {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86_400);
  const parts = [
    { value: Math.floor(total / 3600) % 24, label: "Hours" },
    { value: Math.floor(total / 60) % 60, label: "Min" },
    { value: total % 60, label: "Sec" },
  ];
  return days > 0 ? [{ value: days, label: "Days" }, ...parts] : parts;
}
