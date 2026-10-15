import { useEffect, useState } from 'react';
import { VIEWPORT } from '../lib/config';

export interface ViewportSize {
  width: number;
  height: number;
}

/** Large-viewport height (address bar hidden); falls back to innerHeight. */
function largeViewportHeight(): number {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100lvh;visibility:hidden';
  document.body.appendChild(probe);
  const h = probe.offsetHeight;
  probe.remove();
  return Math.max(window.innerHeight, h);
}

const measure = (): ViewportSize => ({ width: window.innerWidth, height: largeViewportHeight() });

/**
 * Canvas size that ignores mobile address-bar show/hide: on coarse devices,
 * if the width is unchanged and the height changed by < 160px, the resize
 * is skipped so the scene does not jump.
 */
export function useStableViewport(coarse: boolean): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(measure);

  useEffect(() => {
    let last = { width: window.innerWidth, height: window.innerHeight };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (coarse && w === last.width && Math.abs(h - last.height) < VIEWPORT.addressBarTolerance) return;
      last = { width: w, height: h };
      setSize(measure());
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [coarse]);

  return size;
}
