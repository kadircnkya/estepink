import { useRef, useEffect } from 'react';
import { LOADER } from '../lib/config';

interface LoaderProps {
  done: boolean;
}

/** Full-screen pink fade-in / fade-out loader. Hidden from SR when done. */
export function Loader({ done }: LoaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (done) {
      el.style.transition = `opacity ${LOADER.fadeMs}ms ease`;
      el.style.opacity = '0';
      const id = setTimeout(() => {
        el.style.display = 'none';
      }, LOADER.fadeMs + 50);
      return () => clearTimeout(id);
    }
  }, [done]);

  return (
    <div
      ref={ref}
      id="loader"
      aria-live="polite"
      aria-label="Yükleniyor"
      role="status"
      className="fixed inset-0 z-[30] flex flex-col items-center justify-center bg-[#fdf4f8]"
    >
      {/* Animated petal dots */}
      <div className="mb-6 flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-pink"
            style={{
              animation: `loader-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="font-serif text-[22px] text-pink">Estepink</p>
    </div>
  );
}
