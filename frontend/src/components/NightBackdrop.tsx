import { useEffect, useRef } from 'react';
import { nightProgress } from '../lib/night';

/**
 * Soft ambient layer over the WebGL canvas (petals stay visible through it).
 * Fades in as the hero fades out, so the plum atmosphere spans every
 * section below the hero. Deliberately restrained: a warm vignette and
 * film grain — no glowing blobs.
 */
export function NightBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (ref.current) ref.current.style.opacity = String(nightProgress());
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: 0, willChange: 'opacity' }}
    >
      {/* warm rose light from the top, deep plum toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(120% 70% at 50% -10%, rgba(232,36,111,0.16) 0%, rgba(232,36,111,0) 60%)',
            'radial-gradient(90% 60% at 100% 100%, rgba(122,40,92,0.22) 0%, rgba(122,40,92,0) 70%)',
            'radial-gradient(140% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(10,3,8,0.55) 100%)',
          ].join(', '),
        }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
