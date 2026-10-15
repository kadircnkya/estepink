import { useSyncExternalStore } from 'react';

// 768px altı mobil ekran kontrolü
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
