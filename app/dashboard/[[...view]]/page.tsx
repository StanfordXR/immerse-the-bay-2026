import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DashboardView } from "@/components/Dashboard/DashboardView";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { isDashboardPage } from "@/data/dashboard-nav";
import { LIVE_DASHBOARD_URL, PORTAL_URL, SITE } from "@/data/site";
import { getAttendee } from "@/lib/attendee";
import { dashboardAccess, DASHBOARD_OPENS_ON } from "@/lib/dashboard-access";
import { WALLET_PASS_PATH, WALLET_QR_PATH } from "@/lib/wallet-pass";
import { walletSigner } from "@/lib/wallet-signer";

export const metadata: Metadata = {
  title: "Live Dashboard",
  description:
    "Live countdown, announcements, calendar, and resources for Immerse the Bay hackers.",
  robots: { index: false, follow: false },
};

/** Lets the phone tab bar sit above the iOS home indicator via safe-area insets. */
export const viewport: Viewport = { viewportFit: "cover" };

export const dynamic = "force-dynamic";

/** The portal route that signs hackers in and hands their session to this site. */
const SIGN_IN_URL = `${PORTAL_URL}/live-dashboard`;

const COMING_SOON = "Live dashboard is coming Wednesday";
const LAUNCH_DETAILS = `Confirmed hackers can sign in starting ${DASHBOARD_OPENS_ON}.`;

/** Only portal-verified staff have early access. */
export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ view?: string[] }>;
  searchParams: Promise<{ signed_in?: string; now?: string }>;
}) {
  const { view = [] } = await params;
  const page = view[0] ?? "home";
  if (view.length > 1 || (view.length === 1 && page === "home") || !isDashboardPage(page)) {
    notFound();
  }

  const [attendee, query, requestHeaders] = await Promise.all([getAttendee(page === "badge"), searchParams, headers()]);
  const now = requestTime(query.now);
  const access = dashboardAccess(attendee, now);
  const { isOpen } = access;
  const badgeQr = page === "badge" && attendee?.status === "confirmed" ? attendee.badgeQr : undefined;
  const hasBadge = access.status === "allowed" && Boolean(badgeQr);
  const onLiveHost = LIVE_DASHBOARD_URL.startsWith("https://")
    && requestHeaders.get("host") === new URL(LIVE_DASHBOARD_URL).host;

  return (
    <main className="relative min-h-screen">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      {access.status === "allowed" ? (
        <DashboardView
          name={access.name}
          audience={attendee?.status === "confirmed" ? attendee.audience : undefined}
          staffRole={page === "badge" && attendee?.status === "confirmed" ? attendee.staffRole : undefined}
          badgeQr={badgeQr}
          walletHref={hasBadge && walletSigner() ? WALLET_PASS_PATH : undefined}
          qrDownloadHref={hasBadge ? WALLET_QR_PATH : undefined}
          page={page}
          onLiveHost={onLiveHost}
          now={now}
        />
      ) : access.status === "waiting" ? (
        <Gate
          title={COMING_SOON}
          body={`You're confirmed for Immerse the Bay. Your live dashboard opens ${DASHBOARD_OPENS_ON}.`}
          action={{ label: "Open the portal", href: `${PORTAL_URL}/dashboard` }}
        />
      ) : access.status === "not-confirmed" ? (
        <Gate
          title={isOpen ? "Dashboard access" : COMING_SOON}
          body={isOpen
            ? "The dashboard is available to staff, reviewers, and hackers who have confirmed their spot. You can check your status in the portal."
            : `${LAUNCH_DETAILS} You can check your RSVP in the portal.`}
          action={{ label: "Open the portal", href: `${PORTAL_URL}/dashboard` }}
        />
      ) : access.status === "signed-out" ? (
        <Gate
          title={isOpen ? "Sign in to the live dashboard" : COMING_SOON}
          body={query.signed_in !== undefined
            ? `We couldn't keep you signed in. Try again, or email ${SITE.email} for help.`
            : isOpen
              ? "Use your Immerse the Bay portal account."
              : `${LAUNCH_DETAILS} Staff and reviewers can sign in now.`}
          action={{ label: "Sign in with the portal", href: SIGN_IN_URL }}
        />
      ) : (
        <Gate
          title="The dashboard is unavailable"
          body="We couldn't check your sign-in just now. Refresh in a moment."
          action={{ label: "Try again", href: "" }}
        />
      )}
    </main>
  );
}

/** The time to render at. In dev, `?now=2026-11-14T12:00-08:00` previews other event phases. */
function requestTime(preview: string | undefined) {
  const previewNow = process.env.NODE_ENV === "development" && preview ? Date.parse(preview) : NaN;
  return Number.isFinite(previewNow) ? previewNow : Date.now();
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
        <a href={SITE.url} className="text-sm text-neon-cyan underline underline-offset-4">Back to the main site</a>
      </GlassCard>
    </Container>
  );
}
