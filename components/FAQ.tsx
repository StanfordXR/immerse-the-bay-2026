"use client";

import { FAQ_ITEMS } from "@/data/faq";
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
      </Container>
    </section>
  );
}
