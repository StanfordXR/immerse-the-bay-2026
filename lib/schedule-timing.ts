import type { AttendeeScheduleDay } from "@/data/types";

type ScheduleEvent = AttendeeScheduleDay["events"][number];
export type ScheduleEventState = "upcoming" | "current" | "past";
export type ScheduleAnchor = { dayIndex: number; eventId?: string };

const dayOnly = /^\d{4}-\d{2}-\d{2}$/;
const pacificDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
});

export function scheduleClock(now: number) {
  const parts = Object.fromEntries(pacificDate.formatToParts(now).map(({ type, value }) => [type, value]));
  return { now, day: `${parts.year}-${parts.month}-${parts.day}` };
}

export function scheduleEventState(event: ScheduleEvent, clock: ReturnType<typeof scheduleClock>): ScheduleEventState {
  const { start, end } = event;
  if (!start) return "upcoming";
  if (dayOnly.test(start)) {
    const lastDay = end && dayOnly.test(end) ? end : start;
    return clock.day < start ? "upcoming" : clock.day > lastDay ? "past" : "current";
  }
  const begins = Date.parse(start);
  if (!Number.isFinite(begins) || clock.now < begins) return "upcoming";
  const finishes = end ? Date.parse(end) : NaN;
  return (Number.isFinite(finishes) ? clock.now < finishes : clock.now === begins) ? "current" : "past";
}

/** Prefer a specific session in progress, then the next start or the last event. */
export function pickScheduleAnchor(days: AttendeeScheduleDay[], now: number): ScheduleAnchor {
  const clock = scheduleClock(now);
  const slots = days.flatMap(({ events }, dayIndex) => events.map((event) => ({
    dayIndex,
    eventId: event.id,
    allDay: dayOnly.test(event.start ?? ""),
    start: Date.parse(event.start ?? ""),
    state: scheduleEventState(event, clock),
  })));
  const timed = slots.filter(({ allDay, start }) => !allDay && Number.isFinite(start)).sort((a, b) => a.start - b.start);
  const current = timed.filter(({ state }) => state === "current");
  const next = timed.find(({ state }) => state === "upcoming");
  const currentAllDay = slots.find(({ allDay, state }) => allDay && state === "current");
  const upcomingAllDay = slots.find(({ allDay, state }) => allDay && state === "upcoming");
  const target = current[current.length - 1]
    ?? (currentAllDay && next?.dayIndex !== currentAllDay.dayIndex ? currentAllDay : next)
    ?? upcomingAllDay
    ?? timed[timed.length - 1]
    ?? slots.find(({ state }) => state === "upcoming")
    ?? slots[slots.length - 1];
  return target ? { dayIndex: target.dayIndex, eventId: target.eventId } : { dayIndex: 0 };
}

/** True once the first timed session has started; before that the event hasn't begun. */
export function scheduleStarted(days: AttendeeScheduleDay[], now: number): boolean {
  return days.some(({ events }) => events.some(({ start }) =>
    !!start && !dayOnly.test(start) && Date.parse(start) <= now));
}
