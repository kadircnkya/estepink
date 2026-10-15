/**
 * Configuration constants for Estepink.
 */

export const BOOK_CONFIG = {
  totalSpreads: 9,
  flippingLeaves: 8,
  flipDurationMs: 650,
} as const;

export const CAMERA = {
  fov: 50,
  fovPortrait: 58,
  near: 0.1,
  far: 100,
  dprMax: 2,
  dprMaxCoarse: 1.75,
} as const;

export const HERO = {
  z: -4.6,
  heroAspect: 1.5,
  posterAspect: 0.5625,
  introSeconds: 1.9,
  sweepDelay: 1.2,
  sweepPeriod: 10,
  sweepSpeed: 0.55,
  sweepOffset: 0.8,
} as const;

export const POINTER = {
  idleMs: 3000,
  autoAmpX: 0.7,
  autoAmpY: 0.4,
  autoPeriodX: 1400,
  autoPeriodY: 1900,
  autoPhaseY: 1,
} as const;

export const VIEWPORT = {
  addressBarTolerance: 160,
} as const;

export const PETALS = {
  z: -3,
  count: 120,
  countCoarse: 36,
  spread: 1.08,
} as const;

export const LOADER = {
  fadeMs: 800,
} as const;

export type NavTarget = 'video' | 'salon' | 'odalar' | 'cihazlar' | 'randevu' | 'hizmetler' | 'iletisim';
