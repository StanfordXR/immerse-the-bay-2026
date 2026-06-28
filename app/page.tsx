import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { Sponsors } from "@/components/Sponsors";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Sponsors />
    </main>
  );
}
