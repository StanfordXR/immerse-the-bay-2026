"use client";

import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 10) * 0.4,
  duration: 8 + (i % 6),
}));

const VOXELS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${10 + (i * 7) % 80}%`,
  bottom: `${5 + (i * 13) % 40}%`,
  size: 24 + (i % 4) * 12,
  delay: i * 0.3,
  rotate: (i * 15) % 45,
}));

/**
 * CSS-based immersive placeholder. Replace the entire component
 * (or swap via HeroBackground) with a React Three Fiber Canvas.
 */
export function PlaceholderScene() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Base cinematic gradient */}
      <motion.div
        className="absolute inset-0 bg-hero-gradient"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute -left-1/4 top-1/4 h-[50vh] w-[50vh] bg-neon-purple/25 blur-[120px]" />
      <motion.div
        className="absolute -right-1/4 bottom-1/4 h-[40vh] w-[40vh] bg-neon-violet/20 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-neon-fuchsia/8 blur-[80px]" />

      {/* Perspective grid floor */}
      <div className="hero-grid absolute inset-0 opacity-40" />

      {/* Scanline overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-scanlines opacity-[0.04]"
        animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute bg-neon-purple-light/60 shadow-glow-purple"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Voxel blocks — placeholder for future 3D geometry */}
      {VOXELS.map((v) => (
        <motion.div
          key={v.id}
          className="absolute border border-neon-purple-light/30 bg-neon-purple/10 shadow-glow"
          style={{
            left: v.left,
            bottom: v.bottom,
            width: v.size,
            height: v.size,
            transform: `rotate(${v.rotate}deg)`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 6 + (v.id % 4),
            delay: v.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Horizon line glow */}
      <motion.div
        className="absolute bottom-[18%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple-light/60 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Vignette for readability */}
      <motion.div className="absolute inset-0 bg-radial-vignette" />

      {/* Future R3F mount hint — hidden in production, useful for devs */}
      <span className="sr-only">Three.js scene placeholder — swap with HeroThreeCanvas</span>
    </motion.div>
  );
}
