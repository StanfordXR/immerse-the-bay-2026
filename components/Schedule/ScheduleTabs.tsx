"use client";

import { useId, useRef, useState } from "react";
import type { AttendeeScheduleDay } from "@/data/types";
import { cn } from "@/lib/utils";

export function ScheduleTabs({ days, showWorkshopFilter = false }: {
  days: AttendeeScheduleDay[];
  showWorkshopFilter?: boolean;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [workshopsOnly, setWorkshopsOnly] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className="mx-auto max-w-4xl">
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
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const count = days.length;
              const next = event.key === "ArrowRight" ? (index + 1) % count
                : event.key === "ArrowLeft" ? (index + count - 1) % count
                : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
              if (next === null) return;
              event.preventDefault();
              setActive(next);
              tabs.current[next]?.focus();
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
      {showWorkshopFilter && (
        <div role="group" aria-label="Schedule filter" className="mt-4 flex flex-wrap gap-2">
          {([[false, "All events"], [true, "Workshops"]] as const).map(([onlyWorkshops, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={workshopsOnly === onlyWorkshops}
              onClick={() => setWorkshopsOnly(onlyWorkshops)}
              className={cn(
                "min-h-10 rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:outline-neon-cyan",
                workshopsOnly === onlyWorkshops ? "border-neon-cyan/60 text-neon-cyan" : "border-white/15 text-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {days.map((day, index) => {
        const events = workshopsOnly ? day.events.filter((event) => event.workshop) : day.events;
        return (
          <section
            key={day.id}
            id={`${id}-day-${day.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${day.id}`}
            hidden={index !== active}
            tabIndex={0}
            className="mt-5 rounded-xl border border-white/15 bg-surface/50"
          >
            <p className="border-b border-white/10 px-4 py-3 text-xs uppercase tracking-widest text-muted sm:px-6">
              {day.label}, {day.date} <span aria-hidden>·</span> All times Pacific
            </p>
            {events.length ? (
              <ol className="divide-y divide-white/10">
                {events.map((event) => (
                  <li key={event.id} className="grid gap-x-5 gap-y-1 px-4 py-4 sm:grid-cols-[10rem_1fr] sm:px-6">
                    {event.start ? <time dateTime={event.start} className="text-sm font-semibold text-neon-cyan">{event.time}</time>
                      : <span className="text-sm font-semibold text-neon-cyan">{event.time}</span>}
                    <div>
                      <h3 className="font-sans font-semibold text-foreground">
                        {event.title}
                        {event.workshop && <span className="ml-2 whitespace-nowrap text-xs font-normal text-neon-purple-light">· Session</span>}
                      </h3>
                      {event.location && <p className="mt-1 text-sm text-muted">{event.location}</p>}
                      {event.description && <p className="mt-1 text-sm leading-relaxed text-muted">{event.description}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-4 py-4 text-sm text-muted sm:px-6">
                {workshopsOnly ? "No workshops scheduled for this day." : "No events posted for this day."}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
