"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GALLERY_IMAGES } from "@/data/gallery";
import type { GalleryImage } from "@/data/types";
import { Container } from "@/components/ui/Container";
import { GALLERY_PHOTO_STYLES, type GalleryPhotoStyle } from "@/lib/gallery";
import { cn } from "@/lib/utils";

const PLACEHOLDER_GRADIENTS = [
  "from-violet-900/80 via-indigo-950/70 to-purple-950/90",
  "from-indigo-900/75 via-violet-950/65 to-fuchsia-950/75",
  "from-purple-900/70 via-blue-950/55 to-violet-950/80",
  "from-cyan-950/45 via-indigo-900/65 to-purple-950/85",
  "from-fuchsia-950/55 via-violet-900/70 to-indigo-950/75",
] as const;

const GAP_PX = 20;
const HOVER_SCALE = 2.05;

interface LiftedPhotoState {
  instanceId: string;
  image: GalleryImage;
  index: number;
  rect: DOMRect;
  style: GalleryPhotoStyle;
}

interface PhotoCardProps {
  image: GalleryImage;
  index: number;
  elevated?: boolean;
}

function PhotoCard({ image, index, elevated = false }: PhotoCardProps) {
  const gradient = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "border border-white/15 bg-white/5 shadow-md backdrop-blur-md",
        elevated &&
          "border-cyan-400/40 shadow-[0_20px_56px_rgba(0,0,0,0.55),0_0_36px_rgba(34,211,238,0.38),0_0_64px_rgba(147,51,234,0.32)]",
      )}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 47vw, 372px"
          className="object-cover"
        />
      ) : (
        <div
          className={cn("h-full w-full bg-gradient-to-br", gradient)}
          aria-hidden
        />
      )}
    </div>
  );
}

interface MarqueePhotoProps {
  image: GalleryImage;
  index: number;
  instanceId: string;
  style: GalleryPhotoStyle;
  liftedImageId: string | null;
  onLift: (state: LiftedPhotoState) => void;
}

function MarqueePhoto({
  image,
  index,
  instanceId,
  style,
  liftedImageId,
  onLift,
}: MarqueePhotoProps) {
  const isGhosted = liftedImageId === image.id;

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onLift({ instanceId, image, index, rect, style });
  };

  return (
    <motion.figure
      className={cn(
        "relative shrink-0 cursor-pointer",
        isGhosted && "pointer-events-none",
      )}
      style={{
        width: style.width,
        aspectRatio: style.aspectRatio,
        marginTop: style.yOffset,
        rotate: style.rotate,
      }}
      onPointerEnter={handlePointerEnter}
      animate={{ opacity: isGhosted ? 0 : 1 }}
      transition={{ duration: 0 }}
      aria-hidden={isGhosted}
    >
      <PhotoCard image={image} index={index} />
    </motion.figure>
  );
}

interface LiftedPhotoOverlayProps {
  state: LiftedPhotoState;
  onRelease: () => void;
}

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function LiftedPhotoOverlay({ state, onRelease }: LiftedPhotoOverlayProps) {
  const { rect, style, image, index } = state;
  const overlayRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) onRelease();
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onRelease]);

  return (
    <motion.figure
      ref={overlayRef}
      className="pointer-events-auto fixed z-[200] cursor-pointer"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        transformOrigin: "center center",
      }}
      initial={{ scale: 1, rotate: style.rotate }}
      animate={{ scale: HOVER_SCALE, rotate: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      onPointerLeave={onRelease}
    >
      <PhotoCard image={image} index={index} elevated />
    </motion.figure>
  );
}

interface MarqueeStripProps {
  stripKey: string;
  liftedImageId: string | null;
  onLift: (state: LiftedPhotoState) => void;
  ariaHidden?: boolean;
}

function MarqueeStrip({
  stripKey,
  liftedImageId,
  onLift,
  ariaHidden = false,
}: MarqueeStripProps) {
  return (
    <div
      className="flex shrink-0 items-center"
      style={{ gap: GAP_PX }}
      aria-hidden={ariaHidden}
    >
      {GALLERY_IMAGES.map((image, index) => {
        const instanceId = `${stripKey}-${image.id}`;
        return (
          <MarqueePhoto
            key={instanceId}
            image={image}
            index={index}
            instanceId={instanceId}
            style={GALLERY_PHOTO_STYLES[index]}
            liftedImageId={liftedImageId}
            onLift={onLift}
          />
        );
      })}
    </div>
  );
}

export function FloatingGallery() {
  const [mounted, setMounted] = useState(false);
  const [lifted, setLifted] = useState<LiftedPhotoState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLift = useCallback((state: LiftedPhotoState) => {
    setLifted(state);
  }, []);

  const handleRelease = useCallback(() => {
    setLifted(null);
  }, []);

  useEffect(() => {
    if (!lifted) return;

    const clearLift = () => setLifted(null);

    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) clearLift();
    };

    document.addEventListener("scroll", clearLift, { passive: true, capture: true });
    window.addEventListener("wheel", clearLift, { passive: true });
    window.addEventListener("touchmove", clearLift, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.visualViewport?.addEventListener("scroll", clearLift);

    return () => {
      document.removeEventListener("scroll", clearLift, { capture: true });
      window.removeEventListener("wheel", clearLift);
      window.removeEventListener("touchmove", clearLift);
      window.removeEventListener("keydown", onKeyDown);
      window.visualViewport?.removeEventListener("scroll", clearLift);
    };
  }, [lifted]);

  return (
    <div aria-label="Hackathon photo gallery" className="relative w-full">
      <Container className="pb-16 sm:pb-20">
        <div
          className={cn(
            "relative w-full overflow-hidden border border-white/10",
            "bg-gradient-to-b from-navy/95 via-void to-void",
            "shadow-[inset_0_0_60px_rgba(124,58,237,0.1)]",
            "h-[240px] sm:h-[300px] lg:h-[340px]",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.14),transparent_72%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent"
            aria-hidden
          />

          <div className="flex h-full items-center overflow-hidden">
            <div
              className="flex w-max animate-gallery-marquee will-change-transform"
              style={{ gap: GAP_PX }}
            >
              <MarqueeStrip
                stripKey="a"
                liftedImageId={lifted?.image.id ?? null}
                onLift={handleLift}
              />
              <MarqueeStrip
                stripKey="b"
                liftedImageId={lifted?.image.id ?? null}
                onLift={handleLift}
                ariaHidden
              />
            </div>
          </div>
        </div>
      </Container>

      {mounted &&
        lifted &&
        createPortal(
          <LiftedPhotoOverlay
            key={lifted.instanceId}
            state={lifted}
            onRelease={handleRelease}
          />,
          document.body,
        )}
    </div>
  );
}
