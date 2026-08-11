import type { Metadata } from "next";
import { ScheduleView } from "@/components/Schedule/ScheduleView";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Three-day event schedule for Immerse the Bay — Stanford's XR hackathon.",
};

export default function SchedulePage() {
  return (
    <main className="relative min-h-screen pt-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <ScheduleView />
    </main>
  );
}
