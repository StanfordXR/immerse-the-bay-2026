import { GALLERY_IMAGES } from "@/data/gallery";
import type { GalleryImage } from "@/data/types";

export interface GalleryPhotoStyle {
  height: string;
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

const BASE_SIZE_SCALE = 1.69;
/** Uniform image enlargement in the fixed-height marquee band. */
const IMAGE_SIZE_MULTIPLIER = 1.25;
const SIZE_SCALE = BASE_SIZE_SCALE * IMAGE_SIZE_MULTIPLIER;

/** Compress vertical spread so larger photos stay inside the fixed-height band. */
const Y_OFFSET_SCALE = 0.28;

/** Deterministic per-photo variation (seeded by index, never Math.random). */
export function getGalleryPhotoStyle(
  index: number,
  image: GalleryImage,
): GalleryPhotoStyle {
  const aspect = round(image.width / image.height, 4);
  const heightPx = round((124 + seeded(index, 1) * 159) * (SIZE_SCALE / 2.1125));
  const heightVw = round((18 + seeded(index, 5) * 8) * (SIZE_SCALE / 2.1125), 2);
  const minHeightRem = round(5.5 * (SIZE_SCALE / 2.1125), 3);

  return {
    height: `clamp(${minHeightRem}rem, ${heightVw}vw, ${heightPx}px)`,
    aspectRatio: aspect,
    rotate: round(-7 + seeded(index, 3) * 14, 2),
    yOffset: round((-10 + seeded(index, 4) * 20) * Y_OFFSET_SCALE, 2),
  };
}

/** Precomputed once so SSR and client always share identical layout values. */
export const GALLERY_PHOTO_STYLES: GalleryPhotoStyle[] = GALLERY_IMAGES.map(
  (image, index) => getGalleryPhotoStyle(index, image),
);

export const GALLERY_MARQUEE_DURATION_S = 88;
