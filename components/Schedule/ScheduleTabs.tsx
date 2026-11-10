"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AttendeeScheduleDay } from "@/data/types";
import { pickScheduleAnchor, scheduleClock, scheduleEventState, scheduleStarted, type ScheduleAnchor } from "@/lib/schedule-timing";
import { cn } from "@/lib/utils";

const eventKey = (dayIndex: number, eventId: string) => `${dayIndex}:${eventId}`;

export function ScheduleTabs({ days, initialNow }: {
  days: AttendeeScheduleDay[];
  initialNow: number;
}) {
  const id = useId();
  const [initialAnchor] = useState(() => pickScheduleAnchor(days, initialNow));
  const [selection, setSelection] = useState<ScheduleAnchor>(initialAnchor);
  const [now, setNow] = useState(initialNow);
  const active = selection.dayIndex;
  const clock = scheduleClock(now);
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const eventNodes = useRef(new Map<string, HTMLLIElement>());

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
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

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
            <ol className="divide-y divide-white/10">
              {day.events.map((event) => {
                const state = scheduleEventState(event, clock);
                const key = eventKey(index, event.id);
                const timeClass = cn("text-sm font-semibold", state === "past" ? "text-muted" : "text-neon-cyan");
                return (
                  <li
                    key={event.id}
                    ref={(node) => { if (node) eventNodes.current.set(key, node); else eventNodes.current.delete(key); }}
                    data-event-state={state}
                    data-schedule-anchor={selection.dayIndex === index && selection.eventId === event.id ? "true" : undefined}
                    className={cn(
                      "grid scroll-mt-[var(--schedule-margin)] gap-x-5 gap-y-1 border-l-2 px-4 py-4 sm:grid-cols-[10rem_1fr] sm:px-6",
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
                      {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
                      {event.description && <p className="mt-1 text-sm leading-relaxed text-muted">{event.description}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
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
