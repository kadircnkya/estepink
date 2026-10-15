import { useFrame } from '@react-three/fiber';
import { clamp } from '../lib/math';
import { useMotion, type MotionState } from '../lib/motion';
import { updatePointerTarget } from './usePointer';

export const maxScroll = (): number =>
  Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/** Update scroll position naturally without delay/hijack */
export function stepScroll(m: MotionState): void {
  const s = m.scroll;
  s.tgt = clamp(window.scrollY / maxScroll(), 0, 1);
  s.cur = s.tgt;
  s.vel = 0;
  s.v = 0;
}

/**
 * Tracks viewport scroll naturally and updates pointer targets.
 */
export function useScrollProgress(_reduced: boolean, coarse: boolean): void {
  const m = useMotion();
  useFrame(() => {
    stepScroll(m);
    updatePointerTarget(m, performance.now(), coarse);
    m.listeners.forEach((l) => l(m));
  }, -2);
}
