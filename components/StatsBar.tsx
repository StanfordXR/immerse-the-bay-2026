"use client";

import { HACKATHON_STATS } from "@/data/stats";
import type { HackathonStat } from "@/data/types";
import { Container } from "@/components/ui/Container";

function StatCell({ stat }: { stat: HackathonStat }) {
  return (
    <div className="flex min-h-[5rem] flex-col items-center justify-center bg-void/85 px-3 py-4 text-center backdrop-blur-md sm:min-h-[6rem] sm:px-6 sm:py-5">
      <span className="font-mono text-xl font-semibold tracking-tight text-neon-cyan sm:text-3xl">
        {stat.value}
      </span>
      <span className="mt-1.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-foreground/45 sm:text-xs sm:tracking-[0.18em]">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar() {
  return (
    <Container aria-label="Hackathon highlights">
      <div className="hud-corners grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
        {HACKATHON_STATS.map((stat) => (
          <StatCell key={stat.id} stat={stat} />
        ))}
      </div>
    </Container>
  );
}
