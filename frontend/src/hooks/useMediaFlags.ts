import { useSyncExternalStore } from 'react';

const mq = (q: string): MediaQueryList | null =>
  typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(q) : null;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = mq(query);
      m?.addEventListener('change', cb);
      return () => m?.removeEventListener('change', cb);
    },
    () => mq(query)?.matches ?? false,
    () => false,
  );
}

/** data-theme on <html> overrides the system preference. */
function useThemeAttr(): string | null {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => obs.disconnect();
    },
    () => document.documentElement.getAttribute('data-theme'),
    () => null,
  );
}

export interface MediaFlags {
  coarse: boolean;
  reduced: boolean;
  dark: boolean;
}

export function useMediaFlags(): MediaFlags {
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const attr = useThemeAttr();
  const dark = attr === 'dark' || (attr !== 'light' && systemDark);
  return { coarse, reduced, dark };
}

/** Reads the resolved --bg CSS variable (re-evaluated when `dark` flips). */
export function readCssBg(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fbeef1';
}
