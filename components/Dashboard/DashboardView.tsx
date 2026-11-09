import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { HackerBadge } from "@/components/Dashboard/HackerBadge";
import { LiveAnnouncements } from "@/components/Dashboard/LiveAnnouncements";
import { ScheduleTabs } from "@/components/Schedule/ScheduleTabs";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { DASHBOARD_COUNTDOWN_TARGET, DASHBOARD_RESOURCES, DASHBOARD_SPOTIFY_EMBED_URL, DASHBOARD_SPOTIFY_PLAYLIST_URL } from "@/data/dashboard";
import { SITE } from "@/data/site";
import { getAttendeeSchedule } from "@/lib/attendee-schedule";

const sections = [
  ["updates", "Updates"], ["badge", "Badge"], ["schedule", "Schedule"], ["resources", "Resources"],
] as const;

export function DashboardView({ name }: { name: string }) {
  const { schedule, discordUrl } = getAttendeeSchedule();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-void/95 backdrop-blur">
        <Container as="nav" aria-label="Live dashboard navigation" className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
          <a href="#top" className="mr-auto font-sans font-semibold text-foreground">
            Immerse the Bay <span className="ml-1 text-neon-cyan">Live</span>
          </a>
          <a href={SITE.url} className="order-2 text-sm text-muted hover:text-foreground sm:order-3">Main site ↗</a>
          <ul className="order-3 flex w-full flex-wrap gap-x-5 gap-y-2 py-1 text-sm sm:order-2 sm:w-auto">
            {sections.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-muted underline-offset-4 hover:text-neon-cyan hover:underline">{label}</a></li>
            ))}
          </ul>
        </Container>
      </header>
      <Container id="top" className="relative space-y-10 pb-20 pt-9">
        <div className="scroll-mt-28">
          <p className="text-sm uppercase tracking-widest text-neon-cyan">November 13–15 · Stanford</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold sm:text-5xl">Live Dashboard</h1>
          <p className="mt-3 text-muted">Event updates, your check-in badge, and what’s happening this weekend.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <section id="updates" className="scroll-mt-28">
            <GlassCard hover={false} className="h-full">
              <h2 className="mb-4 font-sans text-xl font-semibold">Live announcements</h2>
              <LiveAnnouncements discordUrl={discordUrl} />
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 text-sm text-muted">Countdown to Friday’s opening ceremony</p>
                <CountdownTimer targetIso={DASHBOARD_COUNTDOWN_TARGET} compact />
              </div>
            </GlassCard>
          </section>
          <section id="badge" aria-label="Check-in badge" className="scroll-mt-28">
            <HackerBadge name={name} />
          </section>
        </div>
        <section id="schedule" className="scroll-mt-28">
          <h2 className="mb-4 font-sans text-2xl font-semibold">Weekend schedule</h2>
          {schedule.length > 0
            ? <ScheduleTabs days={schedule} />
            : <p className="text-sm text-muted">The detailed schedule is temporarily unavailable.</p>}
        </section>
        <section id="resources" className="scroll-mt-28">
          <h2 className="mb-4 font-sans text-2xl font-semibold">Resources</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {DASHBOARD_RESOURCES.map((resource) => {
              const href = resource.id === "discord" ? discordUrl : resource.href;
              return (
                <li key={resource.id} className="rounded-xl border border-white/15 bg-surface/50 p-4">
                  <h3 className="font-sans font-semibold">{resource.title}</h3>
                  <p className="mt-2 text-sm text-muted">{resource.description}</p>
                  {href && <a href={href} className="mt-3 inline-block text-sm text-neon-cyan underline underline-offset-4">Open {resource.title.toLowerCase()}</a>}
                </li>
              );
            })}
          </ul>
          <details className="mt-5 rounded-xl border border-white/15 bg-surface/50 p-4">
            <summary className="cursor-pointer font-sans font-semibold">Event playlist</summary>
            <iframe className="mt-3 h-40 w-full border-0" src={DASHBOARD_SPOTIFY_EMBED_URL} title="Immerse the Bay Spotify playlist" loading="lazy" />
            <a className="text-sm text-neon-cyan underline" href={DASHBOARD_SPOTIFY_PLAYLIST_URL}>Open in Spotify</a>
          </details>
        </section>
      </Container>
    </>
  );
}
