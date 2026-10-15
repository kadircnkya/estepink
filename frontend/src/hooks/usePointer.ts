import { useEffect } from 'react';
import { POINTER } from '../lib/config';
import type { MotionState } from '../lib/motion';

/**
 * Tracks the real pointer into the motion store. Touch moves are listened to
 * passively and never call preventDefault, so page scrolling is untouched.
 */
export function usePointer(m: MotionState): void {
  useEffect(() => {
    const move = (x: number, y: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      m.pointer.mxn = x / w - 0.5;
      m.pointer.myn = y / h - 0.5;
      m.pointer.lastMove = performance.now();
    };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [m]);
}

/**
 * Effective pointer for the cursor light and petal push: follows an
 * automatic Lissajous path on touch devices or after 3 s of inactivity.
 */
export function updatePointerTarget(m: MotionState, now: number, coarse: boolean): void {
  const p = m.pointer;
  const idle = coarse || now - p.lastMove > POINTER.idleMs;
  if (idle) {
    p.qx = POINTER.autoAmpX * Math.sin(now / POINTER.autoPeriodX);
    p.qy = POINTER.autoAmpY * Math.sin(now / POINTER.autoPeriodY + POINTER.autoPhaseY);
  } else {
    p.qx = p.mxn * 2;
    p.qy = -p.myn * 2;
  }
}
