"use client";

import { motion } from "framer-motion";

// JPEG at 2560px: the PNG original was 1.86 MB on the first-paint
// critical path; this is visually identical at ~40% the bytes.
const HERO_BACKGROUND_IMAGE = "/images/logo/ITBMainDesign.jpg";

export function HeroImageBackground() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-void"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_BACKGROUND_IMAGE}
        alt=""
        className="h-full w-full object-cover object-[center_25%] sm:object-[center_30%] brightness-110 saturate-110"
      />

      {/* Light overlay — keeps text readable without dulling the art */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/45 via-void/10 to-void/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,transparent_0%,rgba(6,4,12,0.28)_100%)]" />
    </motion.div>
  );
}
