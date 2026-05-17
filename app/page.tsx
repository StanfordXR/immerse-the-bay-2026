import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AboutSection } from "@/components/sections/AboutSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { TracksSection } from "@/components/sections/TracksSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TracksSection />
        <ScheduleSection />
        <SponsorsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
