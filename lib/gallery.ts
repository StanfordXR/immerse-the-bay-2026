import { GALLERY_IMAGES } from "@/data/gallery";

export interface GalleryPhotoStyle {
  width: string;
  aspectRatio: number;
  rotate: number;
  yOffset: number;
}

function seeded(index: number, salt: number): number {
  const v = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

const SIZE_SCALE = 1.69;
/** Compress vertical spread so larger photos stay inside the fixed-height band. */
const Y_OFFSET_SCALE = 0.35;
/**
 * Scale aspect with width so rendered height stays ~unchanged in the fixed container
 * while photos grow 30% wider (more prominent in the horizontal marquee).
 */
const ASPECT_SCALE = SIZE_SCALE;

/** Deterministic per-photo variation (seeded by index, never Math.random). */
export function getGalleryPhotoStyle(index: number): GalleryPhotoStyle {
  const widthPx = round((168 + seeded(index, 1) * 92) * SIZE_SCALE);
  const aspect = round((1.15 + seeded(index, 2) * 0.55) * ASPECT_SCALE, 4);
  const widthVw = round((9 + seeded(index, 5) * 4) * SIZE_SCALE, 2);
  const minWidthRem = round(7.375 * SIZE_SCALE, 3);

  return {
    width: `clamp(${minWidthRem}rem, ${widthVw}vw, ${widthPx}px)`,
    aspectRatio: aspect,
    rotate: round(-7 + seeded(index, 3) * 14, 2),
    yOffset: round((-10 + seeded(index, 4) * 20) * Y_OFFSET_SCALE, 2),
  };
}

/** Precomputed once so SSR and client always share identical layout values. */
export const GALLERY_PHOTO_STYLES: GalleryPhotoStyle[] = GALLERY_IMAGES.map(
  (_, index) => getGalleryPhotoStyle(index),
);

export const GALLERY_MARQUEE_DURATION_S = 88;
