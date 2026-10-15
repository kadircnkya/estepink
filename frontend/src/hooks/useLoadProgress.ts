import { useSyncExternalStore } from 'react';
import { DefaultLoadingManager } from 'three';

/**
 * Texture load percentage from three's DefaultLoadingManager (used by
 * useLoader(TextureLoader)). Subscribed at module load so no progress
 * event is missed before React mounts.
 */
let percent = 0;
const listeners = new Set<() => void>();

DefaultLoadingManager.onProgress = (_url, loaded, total) => {
  const next = total > 0 ? Math.round((loaded / total) * 100) : 0;
  if (next === percent) return;
  percent = next;
  listeners.forEach((l) => l());
};

export function useLoadProgress(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => percent,
    () => 0,
  );
}
