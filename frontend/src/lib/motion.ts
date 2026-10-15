import { createContext, useContext, useEffect, useRef } from 'react';

/**
 * Mutable, per-frame animation state. Never stored in React state: it is
 * written inside useFrame and read by shaders / DOM refs directly.
 */
export interface MotionState {
  scroll: {
    /** smoothed progress */
    cur: number;
    /** raw target progress (scrollY / max) */
    tgt: number;
    /** smoothed velocity */
    vel: number;
    /** clamped velocity used by shaders (0 when reduced motion) */
    v: number;
  };
  pointer: {
    /** normalized pointer, -0.5 … +0.5 */
    mxn: number;
    myn: number;
    lastMove: number;
    /** effective pointer for light / petals, -1 … +1 (auto path when idle) */
    qx: number;
    qy: number;
  };
  /** performance.now() when textures finished loading (intro start) */
  introStart: number | null;
  listeners: Set<MotionListener>;
}

export type MotionListener = (m: MotionState) => void;

export const createMotion = (): MotionState => ({
  scroll: { cur: 0, tgt: 0, vel: 0, v: 0 },
  pointer: { mxn: 0, myn: 0, lastMove: -Infinity, qx: 0, qy: 0 },
  introStart: null,
  listeners: new Set(),
});

export const MotionContext = createContext<MotionState | null>(null);

export function useMotion(): MotionState {
  const m = useContext(MotionContext);
  if (!m) throw new Error('useMotion must be used inside <MotionContext.Provider>');
  return m;
}

/** Subscribe a DOM updater to the per-frame motion tick. */
export function useMotionListener(fn: MotionListener): void {
  const m = useMotion();
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    const l: MotionListener = (s) => ref.current(s);
    m.listeners.add(l);
    return () => {
      m.listeners.delete(l);
    };
  }, [m]);
}
