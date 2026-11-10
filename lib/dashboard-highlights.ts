import type { AttendeeScheduleDay } from "@/data/types";

/** Use actual timed events; date-only rows and entries with no end aren't ongoing. */
export function dashboardHighlights(schedule: AttendeeScheduleDay[], now: number) {
  const timedEvents = schedule.flatMap(({ label, events }) => events.flatMap((event) => {
    if (!event.start?.includes("T")) return [];
    const start = Date.parse(event.start);
    if (!Number.isFinite(start)) return [];
    const end = event.end ? Date.parse(event.end) : NaN;
    return [{ ...event, day: label, startMs: start, endMs: end }];
  })).sort((a, b) => a.startMs - b.startMs);

  const nextTime = timedEvents.find(({ startMs }) => startMs > now)?.startMs;
  return {
    current: timedEvents.filter(({ startMs, endMs }) => startMs <= now && now < endMs).slice(0, 3),
    next: timedEvents.filter(({ startMs }) => startMs === nextTime).slice(0, 3),
  };
}
