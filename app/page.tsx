import type { Metadata } from "next";
import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { Sponsors } from "@/components/Sponsors";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: {
    absolute: SITE.seoTitle,
  },
  description: SITE.seoDescription,
  // Next replaces the whole openGraph object per segment, so images must be
  // repeated here or the homepage (the page people actually share) loses the
  // card artwork the layout defines.
  openGraph: {
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    url: SITE.url,
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Immerse the Bay 2026, Stanford's XR hackathon",
      },
    ],
  },
  twitter: {
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    images: ["/images/og.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Sponsors />
    </main>
  );
}
