import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/Dashboard/DashboardView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { PORTAL_URL, SITE } from "@/data/site";
import { getAttendee } from "@/lib/attendee";

export const metadata: Metadata = {
  title: "Live Dashboard",
  description:
    "Live countdown, announcements, calendar, and resources for Immerse the Bay hackers.",
};

/** The portal route that signs hackers in and hands their session to this site. */
const SIGN_IN_URL = `${PORTAL_URL}/live-dashboard`;

/**
 * Only accepted hackers who confirmed their spot see the dashboard. Everyone
 * else is sent to sign in on the portal, or told why they can't get in.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ signed_in?: string }>;
}) {
  const attendee = await getAttendee();
  // Coming straight back from the portal without a session means the cookie
  // didn't make it; redirecting again would loop.
  const justSignedIn = (await searchParams).signed_in !== undefined;
  if (attendee?.status === "signed-out" && !justSignedIn) redirect(SIGN_IN_URL);

  return (
    <main className="relative min-h-screen pt-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      {attendee?.status === "confirmed" ? (
        <DashboardView />
      ) : attendee?.status === "not-confirmed" ? (
        <Gate
          title="This dashboard is for confirmed hackers"
          body="It opens once you've been accepted and confirmed your spot. Check your status on the portal, or sign in with the account you applied with."
          action={{ label: "Open the portal", href: `${PORTAL_URL}/dashboard` }}
        />
      ) : attendee?.status === "signed-out" ? (
        <Gate
          title="We couldn't keep you signed in"
          body={`Try signing in again. If this keeps happening, email ${SITE.email}.`}
          action={{ label: "Sign in", href: SIGN_IN_URL }}
        />
      ) : (
        <Gate
          title="The dashboard is unavailable"
          body="We couldn't check your sign-in just now. Refresh in a moment."
          action={{ label: "Try again", href: "/dashboard" }}
        />
      )}
    </main>
  );
}

function Gate({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: { label: string; href: string };
}) {
  return (
    <Container as="section" className="relative flex justify-center pb-20 pt-16 sm:pb-28">
      <GlassCard hover={false} className="flex max-w-lg flex-col items-center gap-5 px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="leading-relaxed text-muted">{body}</p>
        <Button href={action.href}>{action.label}</Button>
      </GlassCard>
    </Container>
  );
}
