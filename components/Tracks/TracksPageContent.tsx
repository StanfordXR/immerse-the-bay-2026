"use client";

import { TRACKS_PRESENTATION_URL } from "@/data/tracks";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TracksOverview } from "./TracksOverview";

export function TracksPageContent() {
  return (
    <Container as="section" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Tracks & Prizes"
        title="Tracks & Prizes"
        description="2026 tracks and prizes will be revealed at the November 13 opening ceremony so everyone starts on equal footing. Friday sponsor workshops are a chance to hear from the teams behind sponsored tracks. The 2025 archive below is for reference."
      />

      <div className="mb-10 flex justify-center">
        <Button href={TRACKS_PRESENTATION_URL} variant="secondary" external>
          2025 Tracks & Prizes Deck
        </Button>
      </div>

      <h3 className="mb-4 text-center font-sans text-xl font-semibold">2025 archive</h3>
      <TracksOverview embedded />
    </Container>
  );
}
