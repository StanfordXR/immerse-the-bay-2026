import Image from "next/image";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuArrowUpRight, LuCalendarClock, LuChevronDown, LuMail, LuMapPin, LuMessageCircle, LuMusic, LuPackage, LuRocket, LuTrophy, LuUsers, LuWifi } from "react-icons/lu";
import { ActionLink } from "@/components/Dashboard/ActionLink";
import { DashboardBackdrop } from "@/components/Dashboard/DashboardBackdrop";
import { CheckInBadge } from "@/components/Dashboard/CheckInBadge";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { LiveDot, LiveHero } from "@/components/Dashboard/LiveHero";
import { MobileTabBar } from "@/components/Dashboard/MobileTabBar";
import { SponsorsCard } from "@/components/Dashboard/SponsorsCard";
import { ScheduleTabs } from "@/components/Schedule/ScheduleTabs";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  CLOSING_START,
  DASHBOARD_COUNTDOWN_TARGET,
  DASHBOARD_DEVPOST_URL,
  DASHBOARD_EQUIPMENT_URL,
  DASHBOARD_EYEBROW,
  HACKING_END,
  HACKING_START,
  DASHBOARD_SPOTIFY_EMBED_URL,
  DASHBOARD_SPOTIFY_PLAYLIST_URL,
  STANFORD_CAMPUS_MAP_URL,
} from "@/data/dashboard";
import {
  DASHBOARD_BADGE, DASHBOARD_TABS, SPONSOR_VIEW_TABS, dashboardPath, isSponsorViewPage, sponsorViewPath,
  type DashboardPageId, type SponsorViewPageId,
} from "@/data/dashboard-nav";
import { FAQ_ITEMS } from "@/data/faq";
import { PORTAL_URL, SITE } from "@/data/site";
import { getArrivalGuideFaq } from "@/lib/attendee-help";
import { getAttendeeSchedule } from "@/lib/attendee-schedule";
import { badgeRoleLabel, type StaffRole } from "@/lib/dashboard-access";
import { dashboardHighlights } from "@/lib/dashboard-highlights";
import type { EventTimeline } from "@/lib/dashboard-phase";
import { cn } from "@/lib/utils";

const copy: Record<DashboardPageId, { title: string; description: string }> = {
  home: { title: "Live Dashboard", description: "See what’s happening and get the latest updates from the organizers." },
  schedule: { title: "Schedule", description: "Plan your weekend. All times are Pacific." },
  equipment: { title: "Equipment", description: "Request a headset or other loaner gear through the equipment portal." },
  tracks: { title: "Tracks & Submit", description: "Find the challenges, prize details, and how to submit your project." },
  help: { title: "Help", description: "Get to campus, find teammates, and reach the event team." },
  badge: { title: "My Badge", description: "Your personal check-in information." },
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan";

type DashboardViewProps = {
  now: number;
} & ({
  sponsorView?: false;
  name: string;
  audience?: "staff" | "hacker";
  staffRole?: StaffRole;
  badgeQr?: string;
  walletHref?: string;
  qrDownloadHref?: string;
  page: DashboardPageId;
  onLiveHost: boolean;
} | {
  sponsorView: true;
  page: SponsorViewPageId;
});

export function DashboardView(props: DashboardViewProps) {
  const { page, now, sponsorView } = props;
  const attendee = props.sponsorView ? undefined : props;
  const href = (id: DashboardPageId) => sponsorView
    ? sponsorViewPath(isSponsorViewPage(id) ? id : "home")
    : dashboardPath(id, attendee?.onLiveHost ?? false);
  const isStaff = attendee?.audience === "staff";
  const tabs = sponsorView ? SPONSOR_VIEW_TABS : DASHBOARD_TABS;
  const config: ReturnType<typeof getAttendeeSchedule> =
    page === "badge" || page === "equipment" ? { schedule: [] } : getAttendeeSchedule();
  // Sponsor visitors get only the published timetable fields. Private attendee
  // notes, invite links and resource URLs stay in the hacker dashboard.
  const schedule = sponsorView ? config.schedule.map(({ events, ...day }) => ({
    ...day,
    events: events.map(({ id, title, time, start, end, location }) => ({ id, title, time, start, end, location })),
  })) : config.schedule;
  const discordUrl = sponsorView ? undefined : config.discordUrl;
  const arrivalGuideUrl = sponsorView ? undefined : config.arrivalGuideUrl;
  const tracksUrl = sponsorView ? undefined : config.tracksUrl;
  const { submissionUrl, submissionDeadline } = config;
  const highlights = page === "home" && schedule.length ? dashboardHighlights(schedule, now) : null;
  const opened = now >= Date.parse(DASHBOARD_COUNTDOWN_TARGET);
  const projectSubmissionUrl = !sponsorView && opened && submissionUrl?.startsWith(DASHBOARD_DEVPOST_URL)
    ? submissionUrl
    : DASHBOARD_DEVPOST_URL;
  const publicDeadline = submissionDeadline ?? HACKING_END;
  const arrivalFaq = !sponsorView && page === "help" ? getArrivalGuideFaq() : [];
  const timeline: EventTimeline = {
    opening: Date.parse(DASHBOARD_COUNTDOWN_TARGET),
    hackingStart: Date.parse(HACKING_START),
    hackingEnd: Date.parse(publicDeadline),
    closing: Date.parse(CLOSING_START),
  };
  const firstName = attendee ? attendee.name.trim().split(/\s+/)[0] || "hacker" : undefined;
  const heading = sponsorView && page === "tracks"
    ? { title: "Tracks & Devpost", description: "See what participants are building this weekend." }
    : copy[page];

  return (
    <>
      <DashboardBackdrop />
      <a href="#dashboard-content" className="sr-only z-50 bg-void px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to dashboard content
      </a>
      <header data-live-header className="sticky top-0 z-40 border-b border-white/10 bg-void/95 backdrop-blur">
        {/* Keep the logo and account links in one row; phones use the existing bottom event tabs. */}
        <nav aria-label="Live dashboard navigation" className="flex min-h-14 w-full items-center gap-x-2 px-3 sm:min-h-16 sm:gap-x-3 sm:px-5 lg:gap-x-5 lg:px-8">
          <a
            href={href("home")}
            aria-label="Immerse the Bay Live home"
            className={cn("inline-flex min-h-11 shrink-0 items-center rounded-sm py-2", focus)}
          >
            <span className="relative block aspect-[2/1] w-[4.25rem] overflow-hidden sm:w-20 lg:w-24">
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
          <ul aria-label="Event pages" className="hidden min-w-0 flex-1 gap-x-1 overflow-x-auto [scrollbar-color:rgba(255,255,255,0.28)_transparent] [scrollbar-width:thin] md:flex lg:gap-x-3">
            {tabs.map(({ id, label }) => (
              <DashboardNavItem key={id} url={href(id)} label={label} current={page === id} />
            ))}
          </ul>
          {sponsorView ? (
            <span className="ml-auto shrink-0 border-l border-white/25 pl-3 text-sm text-muted sm:pl-4">Sponsor view</span>
          ) : (
            <ul aria-label="Account and staff pages" className="ml-auto flex shrink-0 items-center gap-x-1 border-l border-white/30 pl-1 sm:gap-x-2 sm:pl-2 lg:pl-3">
              <DashboardNavItem url={href(DASHBOARD_BADGE.id)} label={DASHBOARD_BADGE.label} current={page === DASHBOARD_BADGE.id} />
              {isStaff && <DashboardNavItem url={`${PORTAL_URL}/review/check-in`} label="Check-in" />}
            </ul>
          )}
        </nav>
      </header>
      <Container id="dashboard-content" className="relative scroll-mt-20 space-y-7 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 sm:pt-11 md:pb-20">
        {page === "home" ? (
          <LiveHero
            firstName={firstName}
            timeline={timeline}
            initialNow={now}
            submissionUrl={sponsorView ? undefined : projectSubmissionUrl}
            discordUrl={discordUrl}
            badgeHref={attendee?.audience === "hacker" ? href(DASHBOARD_BADGE.id) : undefined}
          />
        ) : (
          <div>
            <p className="text-sm text-neon-purple-light sm:text-base">{DASHBOARD_EYEBROW}</p>
            <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl">{heading.title}</h1>
            <p className="mt-3 text-muted">{heading.description}</p>
          </div>
        )}
        {page === "home" && (
          <>
            <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <GlassCard hover={false} className="flex min-h-[clamp(22rem,63svh,36rem)] min-w-0 flex-col">
                <h2 className="mb-1 flex shrink-0 items-center gap-2.5 font-sans text-xl font-semibold">
                  {opened && <LiveDot />}
                  Announcements
                </h2>
                <p className="mb-4 shrink-0 text-sm text-muted">From the event Discord’s #announcements channel.</p>
                <div className="relative min-h-56 flex-1">
                  <LiveAnnouncements discordUrl={discordUrl} sponsorView={sponsorView} />
                </div>
              </GlassCard>
              <section aria-label="Schedule highlights and playlist" className="flex min-w-0 flex-col gap-5">
                <DashboardCard title={highlights?.current.length ? "Now & next" : "Up next"} icon={LuCalendarClock} className="min-w-0 flex-1">
                  {highlights ? (
                    <div className="space-y-5">
                      {highlights.current.length > 0 && <EventHighlights heading="Happening now" events={highlights.current} />}
                      <EventHighlights
                        heading={highlights.current.length ? "Up next" : undefined}
                        events={highlights.next}
                        empty="That's everything on the schedule."
                      />
                    </div>
                  ) : <p>The detailed schedule isn’t posted yet.</p>}
                  <DashboardLink href={href("schedule")}>Full schedule</DashboardLink>
                </DashboardCard>
                <details open className="group min-w-0 shrink-0 border border-white/10 bg-surface/50 backdrop-blur-xl">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                    <LuMusic aria-hidden className="h-5 w-5 text-neon-purple-light" />
                    <span className="flex-1">
                      <span className="block font-sans font-semibold">Event playlist</span>
                      <span className="block text-sm text-muted">Something to hack to</span>
                    </span>
                    <LuChevronDown aria-hidden className="h-5 w-5 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 sm:px-6">
                    <iframe className="h-40 w-full border-0" src={DASHBOARD_SPOTIFY_EMBED_URL} title="Immerse the Bay Spotify playlist" loading="lazy" />
                    <DashboardLink href={DASHBOARD_SPOTIFY_PLAYLIST_URL}>Open in Spotify</DashboardLink>
                  </div>
                </details>
              </section>
            </div>
            <SponsorsCard />
          </>
        )}
        {page === "schedule" && (schedule.length
          ? <ScheduleTabs days={schedule} initialNow={now} />
          : <p className="text-muted">The detailed schedule is temporarily unavailable. Check event announcements for updates.</p>)}
        {page === "equipment" && (
          <>
            <ol className="grid gap-4 sm:grid-cols-3">
              {EQUIPMENT_STEPS.map(({ title, body }, index) => (
                <li key={title}>
                  <GlassCard hover={false} className="h-full">
                    <p className="text-sm text-neon-purple-light">Step {index + 1}</p>
                    <h2 className="mt-2 font-sans text-lg font-semibold">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                  </GlassCard>
                </li>
              ))}
            </ol>
            <ActionLink href={DASHBOARD_EQUIPMENT_URL} primary icon={LuPackage} className="w-full sm:w-auto">
              Open the equipment portal
            </ActionLink>
          </>
        )}
        {page === "tracks" && (
          <div className="grid gap-5 md:grid-cols-2">
            <DashboardCard title="Tracks & prizes" icon={LuTrophy}>
              <p>{!opened ? "Track rules, judging criteria, and prizes will be revealed at Friday’s opening ceremony, so everyone starts on equal footing."
                : tracksUrl ? "See the official challenges, judging criteria, and prizes."
                  : "Check event announcements for the official track rules, judging criteria, and prizes."}</p>
              <CardActions>
                {opened && tracksUrl
                  ? <ActionLink href={tracksUrl} primary icon={LuArrowUpRight}>See track details</ActionLink>
                  : <ActionLink href={`${SITE.url}/tracks`} icon={LuArrowUpRight}>Browse last year’s tracks</ActionLink>}
              </CardActions>
            </DashboardCard>
            <DashboardCard title={sponsorView ? "Event on Devpost" : "Submit your project"} icon={LuRocket}>
              {sponsorView ? <p>See the official event page on Devpost.</p> : opened ? (
                <p><strong className="text-foreground">Deadline:</strong>{" "}
                  <time dateTime={publicDeadline}>{formatDeadline(publicDeadline)} Pacific</time>
                </p>
              ) : <p>Find Immerse the Bay on Devpost. Submission instructions and the deadline will be announced at the opening ceremony.</p>}
              <CardActions>
                <ActionLink href={projectSubmissionUrl} primary icon={LuArrowUpRight}>Open Devpost</ActionLink>
              </CardActions>
            </DashboardCard>
          </div>
        )}
        {page === "help" && (sponsorView ? (
          <div className="grid gap-5 md:grid-cols-2">
            <DashboardCard title="Sponsor support" icon={LuMapPin}>
              <p>For help with your arrival, workshop, or sponsor table, email Stanford XR or find an organizer at event check-in.</p>
              <CardActions>
                <ActionLink href={`mailto:${SITE.email}`} icon={LuMail}>{SITE.email}</ActionLink>
                <ActionLink href={STANFORD_CAMPUS_MAP_URL} icon={LuMapPin}>Stanford campus map</ActionLink>
              </CardActions>
            </DashboardCard>
            <WifiSupport />
          </div>
        ) : (
          <>
            <DashboardCard title="Ask on Discord" icon={LuMessageCircle}>
              <p>For general event questions, post in <strong className="text-foreground">#event-questions</strong>. We check Discord more often than email. Follow <strong className="text-foreground">#announcements</strong> for updates.</p>
              <p className="mt-3 flex gap-2"><LuUsers aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-neon-purple-light" />
                <span>Looking for teammates? Introduce yourself in <strong className="text-foreground">#introduction</strong>, or join the staff-assisted team formation on Friday.</span>
              </p>
              <CardActions>
                {discordUrl
                  ? <ActionLink href={discordUrl} primary icon={LuMessageCircle}>Open event Discord</ActionLink>
                  : <p>Find the invite in your attendee email.</p>}
              </CardActions>
            </DashboardCard>
            <div className="grid gap-5 md:grid-cols-2">
              <DashboardCard title="Arrival and check-in" icon={LuMapPin}>
                <p>See the Hacker Arrival Guide for check-in windows, directions, and what to bring. If you expect to arrive after 10 PM Friday, email the organizers as soon as possible.</p>
                <CardActions>
                  {arrivalGuideUrl
                    ? <ActionLink href={arrivalGuideUrl} icon={LuCalendarClock}>Open the Hacker Arrival Guide</ActionLink>
                    : <p>Find the guide in your “Know before you go” email.</p>}
                  <ActionLink href={STANFORD_CAMPUS_MAP_URL} icon={LuMapPin}>Stanford campus map</ActionLink>
                </CardActions>
              </DashboardCard>
              <WifiSupport discordUrl={discordUrl} />
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
          </>
        ))}
        {page === "badge" && attendee && (
          <div className="ph-no-capture mx-auto w-full max-w-lg">
            <CheckInBadge name={attendee.name} roleLabel={badgeRoleLabel(attendee.audience, attendee.staffRole)} isStaff={isStaff} qrSrc={attendee.badgeQr} walletHref={attendee.walletHref} qrDownloadHref={attendee.qrDownloadHref} />
          </div>
        )}
      </Container>
      <MobileTabBar tabs={tabs.map(({ id, label }) => ({ id, label, url: href(id) }))} current={page} />
    </>
  );
}

function WifiSupport({ discordUrl }: { discordUrl?: string }) {
  return (
    <DashboardCard title="Wi-Fi and on-site support" icon={LuWifi}>
      <p>Join <strong className="text-foreground">Stanford Visitor</strong>, or use <strong className="text-foreground">eduroam</strong> if your institution supports it. Stanford students: use <strong className="text-foreground">Stanford</strong> when possible to help spread the load.</p>
      <p className="mt-3">{discordUrl
        ? <>Need help? Ask in <strong className="text-foreground">#event-questions</strong> on Discord or find a volunteer at check-in.</>
        : "Need help getting online? Find a volunteer at check-in."} For private dietary or accessibility questions, speak to an organizer or email us.</p>
      <CardActions>
        {discordUrl && <ActionLink href={discordUrl} icon={LuMessageCircle}>Ask on Discord</ActionLink>}
        <ActionLink href={`mailto:${SITE.email}`} icon={LuMail}>{SITE.email}</ActionLink>
      </CardActions>
    </DashboardCard>
  );
}

function DashboardNavItem({ url, label, current }: { url: string; label: string; current?: boolean }) {
  return (
    <li className="shrink-0">
      <a
        href={url}
        aria-current={current ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center whitespace-nowrap border-b-2 px-2 py-2 text-sm font-semibold focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-neon-cyan sm:min-h-12 sm:px-2.5 lg:min-h-14 lg:px-3 lg:text-base xl:px-4 xl:text-lg",
          current ? "border-neon-cyan text-neon-cyan" : "border-transparent text-muted hover:text-foreground",
        )}
      >
        {label}
      </a>
    </li>
  );
}

const EQUIPMENT_STEPS = [
  { title: "Request", body: "Requests open around midday Friday, once inventory is checked in." },
  { title: "Get matched", body: "The first match runs at 9:30 PM Pacific on Friday. Requests in before then get equal priority." },
  { title: "Pick up and return", body: "Check the portal and announcements for pickup. Return your gear to the lending team so they can check it back in." },
];

function DashboardCard({ title, icon: Icon, children, className }: {
  title: string;
  icon?: IconType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <GlassCard hover={false} className={cn("h-full", className)}>
      <h2 className="mb-3 flex items-center gap-2.5 font-sans text-xl font-semibold">
        {Icon && <Icon aria-hidden className="h-5 w-5 shrink-0 text-neon-purple-light" />}
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-muted">{children}</div>
    </GlassCard>
  );
}

/** Row of buttons at the bottom of a card; stacks full-width on phones. */
function CardActions({ children }: { children: ReactNode }) {
  return <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap [&>a]:w-full sm:[&>a]:w-auto">{children}</div>;
}

function DashboardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <a href={href} className={cn("inline-block font-medium text-neon-cyan underline underline-offset-4", focus)}>{children}</a>
    </div>
  );
}

function EventHighlights({ heading, events, empty }: {
  heading?: string;
  events: ReturnType<typeof dashboardHighlights>["current"];
  empty?: string;
}) {
  if (!events.length && !empty) return null;
  return (
    <div>
      {heading && <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-neon-cyan">{heading}</h3>}
      {events.length ? (
        <ul className="divide-y divide-white/10">
          {events.map((event) => (
            <li key={event.id} className="py-2.5 first:pt-0 last:pb-0">
              <p className="font-semibold text-foreground">{event.title}</p>
              <p className="text-xs">{[event.day, event.time, event.location].filter(Boolean).join(" · ")}</p>
            </li>
          ))}
        </ul>
      ) : <p>{empty}</p>}
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
