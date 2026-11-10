"use client";

import { useEffect, useState } from "react";
import { ActionLink } from "@/components/Dashboard/ActionLink";
import { DASHBOARD_EYEBROW } from "@/data/dashboard";
import { countdownParts, dashboardPhase, type DashboardPhase, type EventTimeline } from "@/lib/dashboard-phase";

/** Art from the main site's hero, so the dashboard reads as the same event. */
const HERO_ART = "/images/logo/ITBMainDesign.jpg";
// The hero has no solid fill: the art and gradient are partly see-through, so the
// dashboard backdrop (glows, shooting stars) shows behind it.

const time = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
});
/** "Friday at 7 PM" */
const at = (ms: number) => {
  const parts = time.formatToParts(ms);
  const day = parts.find(({ type }) => type === "weekday")?.value;
  const clock = time.format(ms).replace(`${day} `, "").replace(":00 ", " ");
  return `${day} at ${clock}`;
};

interface LiveHeroProps {
  firstName: string;
  timeline: EventTimeline;
  /** Server time at render, so the first client render matches the HTML. */
  initialNow: number;
  submissionUrl?: string;
  discordUrl?: string;
  badgeHref?: string;
}

/**
 * The home tab's hero. Ticks every second and changes with the event: a
 * countdown to opening, then to hacking, a progress bar while hacking (pushing
 * Submit in the final stretch), then the closing ceremony.
 */
export function LiveHero({ firstName, timeline, initialNow, submissionUrl, discordUrl, badgeHref }: LiveHeroProps) {
  // Ticks forward from the server's clock rather than the device's, so a phone
  // with the wrong time still counts down correctly.
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const mountedAt = performance.now();
    const id = window.setInterval(() => setNow(initialNow + performance.now() - mountedAt), 1000);
    return () => window.clearInterval(id);
  }, [initialNow]);

  const phase = dashboardPhase(timeline, now);
  const { headline, detail } = heroCopy(phase, timeline, now, firstName);
  const live = phase.id === "opening" || phase.id === "hacking";
  const submitFirst = phase.id === "hacking" && phase.finalStretch && submissionUrl;

  return (
    <section
      aria-labelledby="live-hero-title"
      className="hud-corners relative isolate overflow-hidden border border-white/10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative, already optimized on the main site */}
      <img src={HERO_ART} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_30%] opacity-45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-void/90 via-void/65 to-void/25 sm:bg-gradient-to-r sm:from-void/85 sm:via-void/60 sm:to-transparent" />

      <div className="px-5 py-7 sm:px-10 sm:py-12">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-neon-purple-light">
          {live ? <LiveDot /> : null}
          {live ? "Live now" : DASHBOARD_EYEBROW}
        </p>
        {/* ph-no-capture keeps the name out of PostHog session replays, like the badge page. */}
        <p className="ph-no-capture mt-5 text-lg text-foreground/80 sm:text-xl">Welcome {firstName},</p>
        <h1
          id="live-hero-title"
          // The glitch layers repeat the text via ::before/::after; the label keeps screen readers to one copy.
          aria-label={headline}
          data-text={headline}
          className="glitch-text mt-1 font-hero-title text-4xl leading-[1.05] text-foreground sm:text-6xl"
        >
          {headline}
        </h1>

        {"target" in phase && phase.target > now && (
          <Countdown ms={phase.target - now} />
        )}

        {phase.id === "hacking" && (
          <div className="mt-6 max-w-xl">
            <div
              role="progressbar"
              aria-label="Hacking time elapsed"
              aria-valuenow={Math.round(phase.progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 overflow-hidden bg-white/10"
            >
              <div
                className="h-full bg-gradient-to-r from-neon-violet to-neon-fuchsia shadow-glow-purple transition-[width] duration-1000"
                style={{ width: `${phase.progress * 100}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {Math.floor(phase.progress * 100)}% of hacking time used
            </p>
          </div>
        )}

        <p className="mt-6 max-w-xl leading-relaxed text-muted">{detail}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {submitFirst && <ActionLink href={submissionUrl} primary>Submit your project</ActionLink>}
          {phase.id === "before" && badgeHref && <ActionLink href={badgeHref} primary>Show my badge</ActionLink>}
          {phase.id === "hacking" && !submitFirst && submissionUrl && <ActionLink href={submissionUrl}>Project submissions</ActionLink>}
          {discordUrl && <ActionLink href={discordUrl}>Join the Discord</ActionLink>}
        </div>
        {discordUrl && (
          <p className="mt-3 text-sm text-muted">Live announcements, teammates, and sponsor info all happen on Discord.</p>
        )}
      </div>
    </section>
  );
}

function heroCopy(phase: DashboardPhase, timeline: EventTimeline, now: number, firstName: string) {
  switch (phase.id) {
    case "before":
      return { headline: "Liftoff in", detail: `The opening ceremony starts on ${at(timeline.opening)}. Please have your badge ready for check-in!` };
    case "opening":
      return { headline: "Hacking starts in", detail: `Find your team and get set up. Hacking begins ${at(timeline.hackingStart)}.` };
    case "hacking":
      return phase.finalStretch
        ? { headline: "Submissions close in", detail: `Final stretch. Submit before ${at(timeline.hackingEnd)}, even if it's rough.` }
        : { headline: "Hacking ends in", detail: `Submissions are due ${at(timeline.hackingEnd)}. Pace yourself and grab some food.` };
    case "wrap-up":
      return now < timeline.closing
        ? { headline: "Closing ceremony in", detail: "Hacking's done. Judges are making the rounds." }
        : { headline: "Closing ceremony", detail: "Winners are being announced now." };
    case "after":
      return { headline: "That's a wrap", detail: `Thanks for building with us, ${firstName}. See you next year.` };
  }
}

function Countdown({ ms }: { ms: number }) {
  return (
    <div className="mt-6 flex gap-2 sm:gap-3" role="timer" aria-live="off">
      {countdownParts(ms).map(({ value, label }) => (
        <div key={label} className="flex min-w-[4.25rem] flex-col items-center border border-white/15 bg-void/70 px-2 py-3 backdrop-blur sm:min-w-24 sm:py-4">
          <span className="font-mono text-3xl font-semibold tabular-nums text-neon-purple-light [text-shadow:0_0_18px_rgb(192_132_252/0.55)] sm:text-5xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Pulsing dot that marks live content; still under reduced motion. */
export function LiveDot() {
  return (
    <span aria-hidden className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-neon-fuchsia opacity-75 motion-safe:animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-fuchsia" />
    </span>
  );
}
