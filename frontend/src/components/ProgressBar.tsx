import { useRef } from 'react';
import { useMotionListener } from '../lib/motion';

/** 3px pink progress bar that tracks scroll progress via motion store. */
export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  useMotionListener((m) => {
    if (ref.current) ref.current.style.transform = `scaleX(${m.scroll.cur})`;
  });
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[6] h-[3px] w-full origin-left bg-pink"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
