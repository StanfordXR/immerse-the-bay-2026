import type { Metadata } from "next";
import { DashboardView } from "@/components/Dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Live Dashboard",
  description:
    "Live countdown, announcements, calendar, and resources for Immerse the Bay hackers.",
};

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen pt-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <DashboardView />
    </main>
  );
}
