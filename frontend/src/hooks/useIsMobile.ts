import { useSyncExternalStore } from 'react';

/** Matches Tailwind's `max-md` (below 768px). Desktop/tablet stay untouched. */
const QUERY = '(max-width: 767.98px)';

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
