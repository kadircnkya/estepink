/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  /** Backend base URL in production (e.g. https://api.estepink.com). Empty = same origin / dev proxy. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * `inert` is not yet in @types/react (<18.3 ships without it).
 * Augment React's HTML attributes so JSX accepts it.
 */
declare namespace React {
  interface HTMLAttributes<T> {
    inert?: '' | undefined;
  }
}

