import type { Metadata } from "next";
import { TracksPageContent } from "@/components/Tracks/TracksPageContent";

export const metadata: Metadata = {
  title: "Tracks & Prizes | Immerse the Bay 2026",
  description: "Hackathon tracks, resources, mentors, and prizes for Immerse the Bay 2026.",
};

export default function TracksPage() {
  return (
    <main className="relative min-h-screen pt-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <TracksPageContent />
    </main>
  );
}
