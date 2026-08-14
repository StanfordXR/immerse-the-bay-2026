"use client";

import dynamic from "next/dynamic";
import { HeroImageBackground } from "./HeroImageBackground";
import { PlaceholderScene } from "./PlaceholderScene";

/**
 * Fullscreen hero background layer.
 *
 * Architecture: this component owns the fixed viewport slot for the hero scene.
 * To migrate to React Three Fiber:
 * 1. Create `HeroThreeCanvas.tsx` with `<Canvas>` + your scene
 * 2. Set `USE_THREE_SCENE = true` below, or pass `mode="three"` as a prop
 * 3. Keep this wrapper's `className` / z-index so Hero content stays on top
 */

const USE_THREE_SCENE = false;

const HeroThreeCanvas = dynamic(
  () => import("./HeroThreeCanvas").then((m) => m.HeroThreeCanvas),
  { ssr: false, loading: () => <PlaceholderScene /> },
);

interface HeroBackgroundProps {
  /** When true, loads the R3F canvas (stub until scene is built). */
  useThree?: boolean;
}

export function HeroBackground({ useThree = USE_THREE_SCENE }: HeroBackgroundProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
      data-hero-background
    >
      {useThree ? <HeroThreeCanvas /> : <HeroImageBackground />}
    </div>
  );
}

