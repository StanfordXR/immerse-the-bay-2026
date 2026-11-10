import type { ReactNode } from "react";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { HackerBadge } from "@/components/Dashboard/HackerBadge";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { ScheduleTabs } from "@/components/Schedule/ScheduleTabs";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  DASHBOARD_COUNTDOWN_TARGET,
  DASHBOARD_EQUIPMENT_URL,
  DASHBOARD_SPOTIFY_EMBED_URL,
  DASHBOARD_SPOTIFY_PLAYLIST_URL,
  STANFORD_CAMPUS_MAP_URL,
} from "@/data/dashboard";
import { DASHBOARD_BADGE, DASHBOARD_TABS, dashboardPath, type DashboardPageId } from "@/data/dashboard-nav";
import { SITE } from "@/data/site";
import { getAttendeeSchedule } from "@/lib/attendee-schedule";
import { dashboardHighlights } from "@/lib/dashboard-highlights";
import { cn } from "@/lib/utils";

const copy: Record<DashboardPageId, { title: string; description: string }> = {
  home: { title: "Live Dashboard", description: "See what’s happening and get the latest updates from the organizers." },
  schedule: { title: "Schedule", description: "Plan your weekend. All times are Pacific." },
  equipment: { title: "Equipment", description: "Request a headset or other loaner gear through the equipment portal." },
  tracks: { title: "Tracks & Submit", description: "Find the challenges, prize details, and how to submit your project." },
  help: { title: "Help", description: "Get to campus, find your way around, and reach the event team." },
  badge: { title: "My Badge", description: "Your personal check-in information." },
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan";

export function DashboardView({ name, page, onLiveHost, now }: {
  name: string;
  page: DashboardPageId;
  onLiveHost: boolean;
  now: number;
}) {
  const href = (id: DashboardPageId) => dashboardPath(id, onLiveHost);
  const config: ReturnType<typeof getAttendeeSchedule> =
    page === "badge" || page === "equipment" ? { schedule: [] } : getAttendeeSchedule();
  const { schedule, discordUrl, arrivalGuideUrl, tracksUrl, submissionUrl, submissionDeadline } = config;
  const highlights = page === "home" && schedule.length ? dashboardHighlights(schedule, now) : null;
  const opened = now >= Date.parse(DASHBOARD_COUNTDOWN_TARGET);

  return (
    <>
      <a href="#dashboard-content" className="sr-only z-50 bg-void px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to dashboard content
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-void/95 backdrop-blur">
        <Container as="nav" aria-label="Live dashboard navigation" className="pt-3">
          <div className="flex items-center justify-between gap-3">
            <a href={href("home")} className={cn("min-w-0 font-sans text-sm font-semibold text-foreground sm:text-base", focus)}>
              Immerse the Bay <span className="text-neon-cyan">Live</span>
            </a>
            <div className="flex shrink-0 items-center gap-4">
              <a href={SITE.url} className={cn("hidden text-sm text-muted hover:text-foreground sm:inline", focus)}>Main site ↗</a>
              <a
                href={href(DASHBOARD_BADGE.id)}
                aria-current={page === DASHBOARD_BADGE.id ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-lg border border-neon-cyan/45 px-3 py-2 text-sm font-semibold text-neon-cyan hover:bg-neon-cyan/10",
                  page === DASHBOARD_BADGE.id && "bg-neon-cyan/10",
                  focus,
                )}
              >
                {DASHBOARD_BADGE.label}
              </a>
            </div>
          </div>
          <ul className="mt-2 flex gap-x-4 overflow-x-auto text-sm sm:gap-x-6">
            {DASHBOARD_TABS.map(({ id, label }) => (
              <li key={id} className="shrink-0">
                <a
                  href={href(id)}
                  aria-current={page === id ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center whitespace-nowrap border-b-2 px-0.5 py-2 font-medium focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neon-cyan",
                    page === id ? "border-neon-cyan text-neon-cyan" : "border-transparent text-muted hover:text-foreground",
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </header>
      <Container id="dashboard-content" className="relative scroll-mt-28 space-y-7 pb-20 pt-8 sm:pt-11">
        <div>
          <p className="text-sm uppercase tracking-widest text-neon-cyan">November 13–15 · Stanford</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl">{copy[page].title}</h1>
          <p className="mt-3 text-muted">{copy[page].description}</p>
        </div>
        {page === "home" && (
          <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
            <DashboardCard title="Live announcements">
              <LiveAnnouncements discordUrl={discordUrl} />
              {!opened && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="mb-3 text-sm text-muted">Countdown to Friday’s opening ceremony</p>
                  <CountdownTimer targetIso={DASHBOARD_COUNTDOWN_TARGET} compact />
                </div>
              )}
            </DashboardCard>
            <DashboardCard title="Now & next">
              {highlights ? (
                <div className="space-y-5">
                  <EventHighlights heading="Happening now" events={highlights.current} empty="No timed sessions right now." />
                  <EventHighlights heading="Up next" events={highlights.next} empty="No upcoming sessions on the schedule." />
                </div>
              ) : <p className="text-sm text-muted">The detailed schedule is temporarily unavailable.</p>}
              <DashboardLink href={href("schedule")}>View the full schedule</DashboardLink>
            </DashboardCard>
          </div>
        )}
        {page === "schedule" && (schedule.length
          ? <ScheduleTabs days={schedule} showWorkshopFilter />
          : <p className="text-muted">The detailed schedule is temporarily unavailable. Check event announcements for updates.</p>)}
        {page === "equipment" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <DashboardCard title="Request and match">
              <p>Requests are expected to open around midday Friday after inventory is checked in. Requests submitted before the first match at <strong className="text-foreground">9:30 PM Pacific on Friday</strong> get equal priority.</p>
              <DashboardLink href={DASHBOARD_EQUIPMENT_URL}>Open the equipment portal</DashboardLink>
            </DashboardCard>
            <DashboardCard title="Pick up and return">
              <p>Check the equipment portal and event announcements for pickup and return instructions. Return your gear to the lending team so they can check it back in.</p>
            </DashboardCard>
          </div>
        )}
        {page === "tracks" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <DashboardCard title="Tracks & prizes">
              <p>{!opened ? "Track rules, judging criteria, and prizes will be revealed at Friday’s opening ceremony."
                : tracksUrl ? "See the official challenges, judging criteria, and prizes."
                  : "Check event announcements for the official track rules, judging criteria, and prizes."}</p>
              {opened && tracksUrl && <DashboardLink href={tracksUrl}>See track details</DashboardLink>}
            </DashboardCard>
            <DashboardCard title="Submit your project">
              {opened && submissionDeadline ? (
                <p><strong className="text-foreground">Deadline:</strong>{" "}
                  <time dateTime={submissionDeadline}>{formatDeadline(submissionDeadline)} Pacific</time>
                </p>
              ) : <p>Check the official submission announcement for the link and deadline.</p>}
              {opened && submissionUrl
                ? <DashboardLink href={submissionUrl}>Open project submissions</DashboardLink>
                : discordUrl && <DashboardLink href={discordUrl}>Check event Discord</DashboardLink>}
            </DashboardCard>
          </div>
        )}
        {page === "help" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <DashboardCard title="Arrival and check-in">
                <p>Use the arrival guide for check-in windows and directions. If you can’t find it, check your attendee email. If you expect to arrive after 10 PM Friday, email the organizers as soon as possible.</p>
                {arrivalGuideUrl && <DashboardLink href={arrivalGuideUrl}>Open the arrival guide</DashboardLink>}
                <DashboardLink href={STANFORD_CAMPUS_MAP_URL}>Stanford campus map</DashboardLink>
              </DashboardCard>
              <DashboardCard title="Wi-Fi and on-site support">
                <p>Follow the Wi-Fi instructions in the arrival guide. If you have trouble connecting or need help on site, ask a volunteer at check-in.</p>
                <DashboardLink href={`mailto:${SITE.email}`}>{SITE.email}</DashboardLink>
              </DashboardCard>
              <DashboardCard title="Event Discord">
                <p>Follow announcements, find teammates, and ask the event team questions. Staff will also help with team formation.</p>
                {discordUrl ? <DashboardLink href={discordUrl}>Join event Discord</DashboardLink> : <p className="mt-3">Look for the invite in your attendee email.</p>}
              </DashboardCard>
            </div>
            <details className="rounded-xl border border-white/15 bg-surface/50 p-4">
              <summary className="cursor-pointer font-sans font-semibold">Event playlist</summary>
              <iframe className="mt-3 h-40 w-full border-0" src={DASHBOARD_SPOTIFY_EMBED_URL} title="Immerse the Bay Spotify playlist" loading="lazy" />
              <DashboardLink href={DASHBOARD_SPOTIFY_PLAYLIST_URL}>Open in Spotify</DashboardLink>
            </details>
            <a href={SITE.url} className={cn("inline-block text-sm text-muted hover:text-foreground sm:hidden", focus)}>Main site ↗</a>
          </>
        )}
        {page === "badge" && <div className="max-w-lg"><HackerBadge name={name} /></div>}
      </Container>
    </>
  );
}

function DashboardCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <GlassCard hover={false} className="h-full">
      <h2 className="mb-3 font-sans text-xl font-semibold">{title}</h2>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </GlassCard>
  );
}

function DashboardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <a href={href} className={cn("inline-block font-medium text-neon-cyan underline underline-offset-4", focus)}>{children}</a>
    </div>
  );
}

function EventHighlights({ heading, events, empty }: {
  heading: string;
  events: ReturnType<typeof dashboardHighlights>["current"];
  empty: string;
}) {
  return (
    <div>
      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-neon-cyan">{heading}</h3>
      {events.length ? (
        <ul className="mt-2 space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <p className="font-semibold text-foreground">{event.title}</p>
              <p className="text-xs">{[event.day, event.time, event.location].filter(Boolean).join(" · ")}</p>
            </li>
          ))}
        </ul>
      ) : <p className="mt-1">{empty}</p>}
    </div>
  );
}

function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}
