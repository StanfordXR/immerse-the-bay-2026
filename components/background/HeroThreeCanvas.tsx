"use client";

import { Canvas } from "@react-three/fiber";
import { PlaceholderScene } from "./PlaceholderScene";

/**
 * React Three Fiber entry point for the hero.
 * Replace the fallback below with your voxel / neon scene.
 */
export function HeroThreeCanvas() {
  return (
  <>
    <Canvas
      className="absolute inset-0"
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 2, 8], fov: 50 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#050508"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 6, 4]} color="#a855f7" intensity={1.2} />
      {/* Add Drei helpers + scene graph here */}
    </Canvas>
    {/* CSS placeholder visible until scene is populated — remove when ready */}
    <PlaceholderScene />
  </>
  );
}
