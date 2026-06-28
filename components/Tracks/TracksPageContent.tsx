"use client";

import { motion } from "framer-motion";
import { TRACKS } from "@/data/tracks";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer } from "@/lib/motion";
import { PrizesSection } from "./PrizesSection";
import { TrackCard } from "./TrackCard";

export function TracksPageContent() {
  return (
    <>
      <Container as="section" className="py-20 sm:py-28">
        <SectionHeading
          eyebrow="Tracks"
          title="Six lanes into immersive creation"
          description="Each track includes sponsor support, hardware, software, APIs, mentors, and resources."
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {TRACKS.map((track) => (
            <li key={track.id}>
              <TrackCard track={track} />
            </li>
          ))}
        </motion.ul>
      </Container>

      <Container>
        <PrizesSection />
      </Container>
    </>
  );
}
