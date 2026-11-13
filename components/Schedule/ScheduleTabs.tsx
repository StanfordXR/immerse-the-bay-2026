"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AttendeeScheduleDay } from "@/data/types";
import { pickScheduleAnchor, scheduleClock, scheduleEventState, scheduleStarted, scheduleTimeMarker, type ScheduleAnchor } from "@/lib/schedule-timing";
import { useEventClock } from "@/lib/use-event-clock";
import { cn } from "@/lib/utils";

const eventKey = (dayIndex: number, eventId: string) => `${dayIndex}:${eventId}`;
const markerTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit",
});

export function ScheduleTabs({ days, initialNow }: {
  days: AttendeeScheduleDay[];
  initialNow: number;
}) {
  const id = useId();
  const [initialAnchor] = useState(() => pickScheduleAnchor(days, initialNow));
  const [selection, setSelection] = useState<ScheduleAnchor>(initialAnchor);
  const now = useEventClock(initialNow, 15_000);
  const active = selection.dayIndex;
  const clock = scheduleClock(now);
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const eventNodes = useRef(new Map<string, HTMLLIElement>());
  const fridayList = useRef<HTMLOListElement>(null);
  const [fridayLayout, setFridayLayout] = useState<{ height: number; offsets: Map<string, number> } | null>(null);
  const activeDay = days[active];
  const marker = activeDay?.id === "friday" ? scheduleTimeMarker(activeDay.events, clock) : null;
  const from = marker && fridayLayout ? fridayLayout.offsets.get(marker.fromId) : undefined;
  const to = marker && fridayLayout
    ? marker.toId ? fridayLayout.offsets.get(marker.toId) : fridayLayout.height
    : undefined;
  const markerOffset = from !== undefined && to !== undefined && marker
    ? from + (to - from) * marker.fraction
    : from;

  useEffect(() => {
    const header = document.querySelector("[data-live-header]");
    const measure = () => {
      const top = Math.ceil(header?.getBoundingClientRect().height ?? 0);
      const extra = Math.ceil(controls.current?.getBoundingClientRect().height ?? 0);
      root.current?.style.setProperty("--schedule-top", `${top}px`);
      root.current?.style.setProperty("--schedule-margin", `${top + extra + 12}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (header) observer.observe(header);
    if (controls.current) observer.observe(controls.current);
    return () => observer.disconnect();
  }, []);

  // Opens on the right day; during the event, also glides to the current session
  // unless it's the day's first. Before the event the page stays put, and
  // switching days never scrolls.
  useEffect(() => {
    const { dayIndex, eventId } = initialAnchor;
    if (!eventId || !scheduleStarted(days, initialNow) || days[dayIndex]?.events[0]?.id === eventId) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    eventNodes.current.get(eventKey(dayIndex, eventId))
      ?.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" });
  }, [days, initialNow, initialAnchor]);

  useEffect(() => {
    const list = fridayList.current;
    if (activeDay?.id !== "friday" || !list) return;
    // Measure actual list rows rather than assuming equal heights: rooms and
    // descriptions wrap differently on a phone. The marker doesn't affect flow.
    const rows = activeDay.events.flatMap(({ id: eventId }) => {
      const row = eventNodes.current.get(eventKey(active, eventId));
      return row ? [{ eventId, row }] : [];
    });
    const measure = () => {
      const bounds = list.getBoundingClientRect();
      if (!bounds.height) return;
      setFridayLayout({
        height: bounds.height,
        offsets: new Map(rows.map(({ eventId, row }) => [eventId, row.getBoundingClientRect().top - bounds.top])),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    for (const { row } of rows) observer.observe(row);
    return () => observer.disconnect();
  }, [active, activeDay]);

  return (
    <div ref={root} className="mx-auto max-w-4xl [--schedule-margin:13rem] [--schedule-top:7.25rem]">
      <div ref={controls} className="sticky top-[var(--schedule-top)] z-30 -mx-1 bg-void/95 px-1 pb-2 pt-2 backdrop-blur">
        <div role="tablist" aria-label="Schedule day" className="grid grid-cols-3 gap-2 sm:gap-3">
          {days.map((day, index) => (
            <button
              key={day.id}
              ref={(node) => { tabs.current[index] = node; }}
              type="button"
              role="tab"
              id={`${id}-tab-${day.id}`}
              aria-controls={`${id}-day-${day.id}`}
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setSelection({ dayIndex: index })}
              onKeyDown={(event) => {
                const count = days.length;
                const next = event.key === "ArrowRight" ? (index + 1) % count
                  : event.key === "ArrowLeft" ? (index + count - 1) % count
                  : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
                if (next === null) return;
                event.preventDefault();
                setSelection({ dayIndex: next });
                tabs.current[next]?.focus({ preventScroll: true });
              }}
              className={cn(
                "rounded-lg border px-2 py-3 text-center focus-visible:outline-2 focus-visible:outline-neon-cyan sm:py-4",
                active === index
                  ? "border-neon-cyan/60 bg-neon-indigo/20 text-foreground"
                  : "border-white/15 bg-surface/50 text-muted hover:border-white/40",
              )}
            >
              <span className="block font-sans text-sm font-semibold sm:text-base">{day.label}</span>
              <span className="mt-1 block text-xs">{day.date.replace("November", "Nov")}</span>
            </button>
          ))}
        </div>
      </div>
      {days.map((day, index) => (
        <section
          key={day.id}
          id={`${id}-day-${day.id}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${day.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="mt-4 scroll-mt-[var(--schedule-margin)] rounded-xl border border-white/15 bg-surface/50"
        >
          <p className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-widest text-muted sm:px-6">
            {day.label}, {day.date} <span aria-hidden>·</span> All times Pacific
          </p>
          {day.events.length ? (
            <div className={cn("relative", day.id === "friday" && "pb-3")}>
              <ol ref={day.id === "friday" ? fridayList : undefined} className="divide-y divide-white/10">
                {day.events.map((event) => {
                  const state = scheduleEventState(event, clock);
                  const key = eventKey(index, event.id);
                  const timeClass = cn("text-sm font-semibold tabular-nums", state === "past" ? "text-muted" : "text-neon-cyan");
                  return (
                    <li
                      key={event.id}
                      ref={(node) => { if (node) eventNodes.current.set(key, node); else eventNodes.current.delete(key); }}
                      data-event-state={state}
                      data-schedule-anchor={selection.dayIndex === index && selection.eventId === event.id ? "true" : undefined}
                      className={cn(
                        "grid scroll-mt-[var(--schedule-margin)] gap-x-5 gap-y-1 border-l-2 py-4 pl-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:pl-6",
                        day.id === "friday" ? "pr-20 sm:pr-28" : "pr-4 sm:pr-6",
                        state === "current" ? "border-l-neon-cyan/80 bg-neon-cyan/8"
                          : state === "past" ? "border-l-transparent bg-void/60" : "border-l-transparent",
                      )}
                    >
                      {event.start ? <time dateTime={event.start} className={timeClass}>{event.time}</time>
                        : <span className={timeClass}>{event.time}</span>}
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h3 className={cn("font-sans font-semibold", state === "past" ? "text-muted" : "text-foreground")}>{event.title}</h3>
                          {state === "current" && <span className="rounded border border-neon-cyan/40 px-2 py-0.5 text-xs font-medium text-neon-cyan">Now</span>}
                          {state === "past" && <span className="sr-only">Past event</span>}
                        </div>
                        {(event.location || event.presenter) && (
                          <p className="mt-1 text-sm text-muted">
                            {event.location}{event.location && event.presenter && " | "}{event.presenter}
                          </p>
                        )}
                        {event.description && <p className={cn("text-sm leading-relaxed text-muted", event.workshop ? "mt-2" : "mt-1")}>{event.description}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {index === active && marker && (
                <div
                  data-friday-time-marker
                  className={cn(
                    "pointer-events-none absolute inset-x-0 z-10 flex -translate-y-1/2 items-center transition-[top] duration-500 motion-reduce:transition-none",
                    markerOffset === undefined && !marker.beforeStart && "invisible",
                  )}
                  style={{ top: markerOffset ?? 0 }}
                >
                  <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-neon-purple-light/15 via-neon-purple-light/25 to-neon-purple-light" />
                  <span className="mr-2 flex min-w-16 flex-col items-center gap-0.5 whitespace-nowrap border border-neon-purple-light/60 bg-void px-1.5 py-1 font-mono font-semibold leading-none text-neon-purple-light shadow-glow-cyan sm:mr-3 sm:flex-row sm:gap-1.5 sm:px-2">
                    <span className="text-[0.6rem] uppercase">{marker.beforeStart ? "Starts" : "Now"}</span>
                    <time className="text-[0.65rem] sm:text-xs" dateTime={new Date(marker.time).toISOString()}>{markerTime.format(marker.time)}</time>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="px-4 py-4 text-sm text-muted sm:px-6">
              No events posted for this day.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
