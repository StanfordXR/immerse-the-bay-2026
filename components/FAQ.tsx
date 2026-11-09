"use client";

import { FAQ_ITEMS } from "@/data/faq";
import { LIVE_DASHBOARD_URL } from "@/data/site";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <Container as="section">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions? We've got answers."
        />
        <Accordion items={FAQ_ITEMS} />
        <p className="mt-8 text-center text-muted">For attendee resources and updates, open the{" "}
          <a href={LIVE_DASHBOARD_URL} className="text-neon-cyan underline underline-offset-4">live dashboard</a>.
        </p>
      </Container>
    </section>
  );
}
