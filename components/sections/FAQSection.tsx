"use client";

import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQSection() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-section-glow pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions? We've got answers."
        />
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
