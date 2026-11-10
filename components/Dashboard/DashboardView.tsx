import Image from "next/image";
import type { ReactNode } from "react";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { CheckInBadge } from "@/components/Dashboard/CheckInBadge";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { ScheduleTabs } from "@/components/Schedule/ScheduleTabs";
import { Accordion } from "@/components/ui/Accordion";
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
import { FAQ_ITEMS } from "@/data/faq";
import { PORTAL_URL, SITE } from "@/data/site";
import { getArrivalGuideFaq } from "@/lib/attendee-help";
import { getAttendeeSchedule } from "@/lib/attendee-schedule";
import type { StaffRole } from "@/lib/dashboard-access";
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

export function DashboardView({ name, audience, staffRole, badgeQr, page, onLiveHost, now }: {
  name: string;
  audience?: "staff" | "hacker";
  staffRole?: StaffRole;
  badgeQr?: string;
  page: DashboardPageId;
  onLiveHost: boolean;
  now: number;
}) {
  const href = (id: DashboardPageId) => dashboardPath(id, onLiveHost);
  const isStaff = audience === "staff";
  const roleLabel = !isStaff ? "Hacker" : staffRole === "admin" ? "Admin" : staffRole === "reviewer" ? "Reviewer" : "Staff";
  const config: ReturnType<typeof getAttendeeSchedule> =
    page === "badge" || page === "equipment" ? { schedule: [] } : getAttendeeSchedule();
  const { schedule, discordUrl, arrivalGuideUrl, tracksUrl, submissionUrl, submissionDeadline } = config;
  const highlights = page === "home" && schedule.length ? dashboardHighlights(schedule, now) : null;
  const opened = now >= Date.parse(DASHBOARD_COUNTDOWN_TARGET);
  const arrivalFaq = page === "help" ? getArrivalGuideFaq() : [];

  return (
    <>
      <a href="#dashboard-content" className="sr-only z-50 bg-void px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to dashboard content
      </a>
      <header data-live-header className="sticky top-0 z-40 border-b border-white/10 bg-void/95 backdrop-blur">
        <Container as="nav" aria-label="Live dashboard navigation" className="pt-3">
          <div className="flex items-center justify-between gap-3">
            <a
              href={href("home")}
              aria-label="Immerse the Bay Live home"
              className={cn("inline-flex min-w-0 items-center rounded-sm", focus)}
            >
              <span className="relative block aspect-[2/1] w-24 shrink-0 overflow-hidden sm:w-28">
                <Image
                  src="/images/logo/ITB_Standard.png"
                  alt=""
                  width={1080}
                  height={1080}
                  unoptimized
                  loading="eager"
                  className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2"
                />
              </span>
            </a>
            <a href={SITE.url} className={cn("hidden text-sm text-muted hover:text-foreground sm:inline", focus)}>Main site ↗</a>
          </div>
          <div className="mt-2 flex min-w-0 items-center gap-1 text-sm sm:gap-4 sm:text-base lg:text-lg">
            <ul aria-label="Event pages" className="flex min-w-0 gap-x-1 overflow-x-auto [scrollbar-color:rgba(255,255,255,0.28)_transparent] [scrollbar-width:thin] sm:gap-x-2 lg:gap-x-3">
              {DASHBOARD_TABS.map(({ id, label }) => (
                <DashboardNavItem key={id} url={href(id)} label={label} current={page === id} />
              ))}
            </ul>
            <ul aria-label="Account and staff pages" className="ml-auto flex shrink-0 items-center gap-x-1 border-l border-white/30 pl-1 sm:gap-x-2 sm:pl-4">
              <DashboardNavItem url={href(DASHBOARD_BADGE.id)} label={DASHBOARD_BADGE.label} current={page === DASHBOARD_BADGE.id} />
              {isStaff && <DashboardNavItem url={`${PORTAL_URL}/review/check-in`} label="Check-in" />}
            </ul>
          </div>
        </Container>
      </header>
      <Container id="dashboard-content" className="relative scroll-mt-36 space-y-7 pb-20 pt-8 sm:pt-11">
        <div>
          <p className="text-sm uppercase tracking-widest text-neon-cyan">November 13–15 · Stanford</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl">{copy[page].title}</h1>
          <p className="mt-3 text-muted">{copy[page].description}</p>
        </div>
        {page === "home" && (
          <div className="grid gap-5 md:min-h-[max(32rem,calc(100svh_-_16rem))] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <GlassCard hover={false} className="min-h-[25rem] min-w-0">
              {!opened && (
                <div className="mb-6 border-b border-white/10 pb-5">
                  <p className="mb-3 text-sm text-muted">Countdown to Friday’s opening ceremony</p>
                  <CountdownTimer targetIso={DASHBOARD_COUNTDOWN_TARGET} compact />
                </div>
              )}
              <h2 className="mb-1 font-sans text-xl font-semibold">Live announcements</h2>
              <p className="mb-4 text-sm text-muted">Updates from the event Discord’s #announcements channel.</p>
              <LiveAnnouncements discordUrl={discordUrl} />
            </GlassCard>
            <DashboardCard title="Now & next" className="min-h-64">
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
        {page === "home" && (
          <details className="rounded-xl border border-white/15 bg-surface/50 p-4">
            <summary className="cursor-pointer font-sans font-semibold">Event playlist</summary>
            <iframe className="mt-3 h-40 w-full border-0" src={DASHBOARD_SPOTIFY_EMBED_URL} title="Immerse the Bay Spotify playlist" loading="lazy" />
            <DashboardLink href={DASHBOARD_SPOTIFY_PLAYLIST_URL}>Open in Spotify</DashboardLink>
          </details>
        )}
        {page === "schedule" && (schedule.length
          ? <ScheduleTabs days={schedule} initialNow={now} />
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
            <DashboardCard title="Ask on Discord">
              <p>For general event questions, post in <strong className="text-foreground">#event-questions</strong>. We check Discord more often than email. Follow <strong className="text-foreground">#announcements</strong> for updates.</p>
              {discordUrl ? <DashboardLink href={discordUrl}>Open event Discord</DashboardLink> : <p className="mt-3">Find the invite in your attendee email.</p>}
            </DashboardCard>
            <div className="grid gap-5 sm:grid-cols-2">
              <DashboardCard title="Arrival and check-in">
                <p>See the Hacker Arrival Guide for check-in windows, directions, and what to bring. If you expect to arrive after 10 PM Friday, email the organizers as soon as possible.</p>
                {arrivalGuideUrl
                  ? <DashboardLink href={arrivalGuideUrl}>Open the Hacker Arrival Guide</DashboardLink>
                  : <p className="mt-3">Find the guide in your “Know before you go” email.</p>}
                <DashboardLink href={STANFORD_CAMPUS_MAP_URL}>Stanford campus map</DashboardLink>
              </DashboardCard>
              <DashboardCard title="Wi-Fi and on-site support">
                <p>If you have trouble connecting or need help on site, ask a volunteer at check-in. For private dietary or accessibility questions, speak to an organizer or email us.</p>
                <DashboardLink href={`mailto:${SITE.email}`}>{SITE.email}</DashboardLink>
              </DashboardCard>
            </div>
            {arrivalFaq.length > 0 && (
              <section aria-labelledby="arrival-faq">
                <h2 id="arrival-faq" className="mb-4 font-sans text-xl font-semibold">From the Hacker Arrival Guide</h2>
                <Accordion items={arrivalFaq} />
              </section>
            )}
            <section aria-labelledby="event-faq">
              <h2 id="event-faq" className="mb-4 font-sans text-xl font-semibold">Event FAQ</h2>
              <Accordion items={FAQ_ITEMS} />
            </section>
            <a href={SITE.url} className={cn("inline-block text-sm text-muted hover:text-foreground sm:hidden", focus)}>Main site ↗</a>
          </>
        )}
        {page === "badge" && (
          <div className="ph-no-capture mx-auto w-full max-w-lg">
            <CheckInBadge name={name} roleLabel={roleLabel} isStaff={isStaff} qrSrc={badgeQr} />
          </div>
        )}
      </Container>
    </>
  );
}

function DashboardNavItem({ url, label, current }: { url: string; label: string; current?: boolean }) {
  return (
    <li className="shrink-0">
      <a
        href={url}
        aria-current={current ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center whitespace-nowrap border-b-2 px-2 py-2 font-semibold focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neon-cyan sm:min-h-12 sm:px-3 lg:min-h-14 lg:px-4",
          current ? "border-neon-cyan text-neon-cyan" : "border-transparent text-muted hover:text-foreground",
        )}
      >
        {label}
      </a>
    </li>
  );
}

function DashboardCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <GlassCard hover={false} className={cn("h-full", className)}>
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
