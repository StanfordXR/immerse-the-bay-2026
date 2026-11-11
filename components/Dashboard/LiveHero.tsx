"use client";

import { useId } from "react";
import { ActionLink } from "@/components/Dashboard/ActionLink";
import { DASHBOARD_EYEBROW } from "@/data/dashboard";
import { countdownParts, dashboardPhase, type DashboardPhase, type EventTimeline } from "@/lib/dashboard-phase";
import { useEventClock } from "@/lib/use-event-clock";

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
  firstName?: string;
  timeline: EventTimeline;
  /** Server time at render, so the first client render matches the HTML. */
  initialNow: number;
  submissionUrl?: string;
  discordUrl?: string;
  badgeHref?: string;
}

/**
 * The home tab's hero. Ticks every second and changes with the event: a
 * countdown to opening, then to hacking, a countdown and progress bar while hacking (pushing
 * Submit in the final stretch), then the closing ceremony.
 */
export function LiveHero({ firstName, timeline, initialNow, submissionUrl, discordUrl, badgeHref }: LiveHeroProps) {
  const now = useEventClock(initialNow, 1000);

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
      <CrescentMoon className="moon-float absolute right-[10%] top-6 -z-10 h-20 w-20 sm:right-[26%] sm:top-10 sm:h-32 sm:w-32" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-void/90 via-void/65 to-void/25 sm:bg-gradient-to-r sm:from-void/85 sm:via-void/60 sm:to-transparent" />

      <div className="px-5 py-7 sm:px-10 sm:py-12">
        <p className="flex items-center gap-2 text-sm text-neon-purple-light sm:text-base">
          {live ? <LiveDot /> : null}
          {live ? "Live now" : DASHBOARD_EYEBROW}
        </p>
        {/* ph-no-capture keeps the name out of PostHog session replays, like the badge page. */}
        <p className="ph-no-capture mt-5 text-lg text-foreground/80 sm:text-xl">{firstName ? `Welcome ${firstName},` : "Welcome, sponsors"}</p>
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

function heroCopy(phase: DashboardPhase, timeline: EventTimeline, now: number, firstName?: string) {
  switch (phase.id) {
    case "before":
      return { headline: "Liftoff in", detail: `The opening ceremony starts on ${at(timeline.opening)}. ${firstName ? "Please have your badge ready for check-in!" : "Thanks for supporting Immerse the Bay!"}` };
    case "opening":
      return { headline: "Hacking starts in", detail: `${firstName ? "Find your team and get set up. " : ""}Hacking begins ${at(timeline.hackingStart)}.` };
    case "hacking":
      return {
        headline: "Hacking ends in",
        detail: !firstName ? `Project submissions are due ${at(timeline.hackingEnd)}.` : phase.finalStretch
          ? `Final stretch. Submit before ${at(timeline.hackingEnd)}, even if it's rough.`
          : `Submissions are due ${at(timeline.hackingEnd)}. Pace yourself and grab some food.`,
      };
    case "wrap-up":
      return now < timeline.closing
        ? { headline: "Closing ceremony in", detail: "Hacking's done. Judges are making the rounds." }
        : { headline: "Closing ceremony", detail: "Winners are being announced now." };
    case "after":
      return { headline: "That's a wrap", detail: `${firstName ? `Thanks for building with us, ${firstName}.` : "Thanks for supporting Immerse the Bay."} See you next year.` };
  }
}

function Countdown({ ms }: { ms: number }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2 sm:gap-3" role="timer" aria-live="off">
      {countdownParts(ms).map(({ value, label }) => (
        <div key={label} className="flex min-w-[3.3rem] flex-col items-center border border-white/15 bg-void/70 px-1.5 py-3 backdrop-blur min-[360px]:min-w-16 sm:min-w-24 sm:px-2 sm:py-4">
          <span className="font-mono text-2xl font-semibold tabular-nums text-neon-purple-light [text-shadow:0_0_18px_rgb(192_132_252/0.55)] min-[360px]:text-3xl sm:text-5xl">
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

/**
 * The crescent from the "Take Me To The Moon" theme, hung over the hero's
 * skyline: a lit disc with an offset disc masked out, a glow that follows the
 * crescent's shape, and a few twinkling sparkles.
 */
/** Four-pointed sparkles around the crescent (viewBox units), one tucked into its curve. */
const SPARKLES = [
  { x: 70, y: 38, size: 6, delay: "0s" },
  { x: 104, y: 8, size: 4.5, delay: "1.1s" },
  { x: 6, y: 2, size: 3.5, delay: "2.3s" },
  { x: 98, y: 82, size: 3, delay: "1.7s" },
];

function CrescentMoon({ className }: { className: string }) {
  const id = useId();
  return (
    <svg
      viewBox="-20 -20 140 140"
      aria-hidden
      className={`${className} -rotate-[18deg] drop-shadow-[0_0_18px_rgb(233_213_255/0.65)]`}
    >
      <defs>
        <radialGradient id={`${id}-lit`} cx="28%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f5edff" />
          <stop offset="100%" stopColor="#ddc4ff" />
        </radialGradient>
        <mask id={`${id}-cut`}>
          <circle cx="50" cy="50" r="40" fill="white" />
          <circle cx="62" cy="42" r="37" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#${id}-lit)`} mask={`url(#${id}-cut)`} />
      {SPARKLES.map(({ x, y, size, delay }) => (
        <path
          key={`${x}-${y}`}
          className="moon-sparkle"
          style={{ "--delay": delay }}
          fill="#faf5ff"
          d={`M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}Z`}
        />
      ))}
    </svg>
  );
}
