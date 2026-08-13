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
  openGraph: {
    title: SITE.seoTitle,
    description: SITE.seoDescription,
    url: SITE.url,
  },
  twitter: {
    title: SITE.seoTitle,
    description: SITE.seoDescription,
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
