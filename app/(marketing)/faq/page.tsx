import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Immerse the Bay — Stanford's XR hackathon.",
};

export default function FAQPage() {
  return (
    <main className="relative min-h-screen pt-20">
      <div className="bg-section-glow pointer-events-none absolute inset-0" aria-hidden />
      <FAQ />
    </main>
  );
}
