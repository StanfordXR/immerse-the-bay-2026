"use client";

import { TRACKS_PRESENTATION_URL } from "@/data/tracks";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TracksTabs } from "./TracksTabs";

export function TracksPageContent() {
  return (
    <Container as="section" className="py-20 sm:py-28">
      <SectionHeading
        eyebrow="Tracks & Prizes"
        title="Choose your lane"
        description="Browse by tab — overview, sponsored partner tracks, or primary categories. Full details are one click away."
      />

      <div className="mb-10 flex justify-center">
        <Button href={TRACKS_PRESENTATION_URL} variant="secondary" external>
          View tracks & prizes deck
        </Button>
      </div>

      <TracksTabs />
    </Container>
  );
}
