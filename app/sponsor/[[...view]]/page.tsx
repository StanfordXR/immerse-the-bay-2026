import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { DashboardView } from "@/components/Dashboard/DashboardView";
import { SponsorLinkGate } from "@/components/Dashboard/SponsorLinkGate";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { isSponsorViewPage } from "@/data/dashboard-nav";
import { SITE } from "@/data/site";
import { hasSponsorAccess } from "@/lib/sponsor-access";

export const metadata: Metadata = {
  title: "Sponsor Dashboard",
  description: "The read-only Immerse the Bay sponsor dashboard.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { viewportFit: "cover" };
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function SponsorDashboardPage({ params }: {
  params: Promise<{ view?: string[] }>;
}) {
  const { view = [] } = await params;
  const page = view[0] ?? "home";
  if (view.length > 1 || (view.length === 1 && page === "home") || !isSponsorViewPage(page)) notFound();

  return (
    <main className="relative min-h-screen">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      {await hasSponsorAccess() ? (
        <>
          <SponsorLinkGate signedIn />
          <DashboardView sponsorView page={page} now={Date.now()} />
        </>
      ) : (
        <Container as="section" className="relative flex justify-center pb-20 pt-16 sm:pt-28">
          <GlassCard hover={false} className="flex max-w-lg flex-col items-center gap-5 px-6 py-10 text-center">
            <p className="text-sm text-neon-purple-light">Immerse the Bay 2026</p>
            <h1 className="font-sans text-3xl font-semibold">Sponsor dashboard</h1>
            <SponsorLinkGate />
            <a href={`mailto:${SITE.email}`} className="text-sm text-neon-cyan underline underline-offset-4">Contact Stanford XR</a>
          </GlassCard>
        </Container>
      )}
    </main>
  );
}
