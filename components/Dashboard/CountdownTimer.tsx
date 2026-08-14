"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

function getTimeLeft(targetIso: string): TimeLeft {
  const diff = new Date(targetIso).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, ended: false };
}

function Unit({
  value,
  label,
  compact = false,
}: {
  value: number;
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex min-w-[4.25rem] flex-col items-center border border-white/10 bg-void/60 px-2 py-[0.65rem] sm:min-w-[6.15rem] sm:px-[1.15rem] sm:py-[0.96rem]"
          : "flex min-w-[4.5rem] flex-col items-center border border-white/10 bg-void/60 px-3 py-4 sm:min-w-[5.5rem] sm:px-4 sm:py-5"
      }
    >
      <span
        className={
          compact
            ? "font-mono text-[1.45rem] font-semibold tabular-nums text-neon-cyan sm:text-[2.31rem]"
            : "font-mono text-3xl font-semibold tabular-nums text-neon-cyan sm:text-4xl lg:text-5xl"
        }
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className={
          compact
            ? "mt-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted sm:text-[0.61rem]"
            : "mt-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs"
        }
      >
        {label}
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  targetIso: string;
  compact?: boolean;
}

export function CountdownTimer({ targetIso, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(targetIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  if (timeLeft.ended) {
    return (
      <p className="font-mono text-lg uppercase tracking-[0.2em] text-neon-cyan sm:text-xl">
        The hackathon is live — check announcements below.
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center ${compact ? "gap-2 sm:gap-[0.77rem]" : "gap-2 sm:gap-3"}`}>
      <Unit value={timeLeft.days} label="Days" compact={compact} />
      <Unit value={timeLeft.hours} label="Hours" compact={compact} />
      <Unit value={timeLeft.minutes} label="Min" compact={compact} />
      <Unit value={timeLeft.seconds} label="Sec" compact={compact} />
    </div>
  );
}
