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
        title="2025 Tracks & Prizes"
        description="Compete across sponsor-backed challenges, primary judging categories, and a bonus wild card track. Each sponsored track includes dedicated resources, mentorship, and prizes."
      />

      <div className="mb-10 flex justify-center">
        <Button href={TRACKS_PRESENTATION_URL} variant="secondary" external>
          2025 Tracks & Prizes Deck
        </Button>
      </div>

      <TracksOverview embedded />
    </Container>
  );
}
