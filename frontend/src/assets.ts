/** Public asset URLs (files live in /public). */
export const ASSETS = {
  hero: '/images/hero.webp',
  poster: '/images/poster.webp',
  logo: '/logo/logo.png',
  video: '/video/promo.mp4',
  /** g1 reception … g9 towel + laser device */
  gallery: Array.from({ length: 9 }, (_, i) => `/images/g${i + 1}.webp`),
} as const;

/** Intrinsic logo size (keeps layout stable before the image loads). */
export const LOGO_SIZE = { width: 760, height: 239 } as const;
