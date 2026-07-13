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

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center border border-white/10 bg-void/60 px-3 py-4 sm:min-w-[5.5rem] sm:px-4 sm:py-5">
      <span className="font-mono text-3xl font-semibold tabular-nums text-neon-cyan sm:text-4xl lg:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
        {label}
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  targetIso: string;
}

export function CountdownTimer({ targetIso }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(targetIso),
  );

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
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      <Unit value={timeLeft.days} label="Days" />
      <Unit value={timeLeft.hours} label="Hours" />
      <Unit value={timeLeft.minutes} label="Min" />
      <Unit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}
