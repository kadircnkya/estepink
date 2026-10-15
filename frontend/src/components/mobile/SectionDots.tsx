import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'giris', label: 'Giriş' },
  { id: 'defter', label: 'Salon & Odalar' },
  { id: 'hizmetler', label: 'Hizmetler' },
  { id: 'iletisim', label: 'Randevu' },
] as const;

/** Right-edge dot indicator showing which full-screen section is active. */
export function SectionDots() {
  const [active, setActive] = useState<string>('giris');

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { threshold: 0.55 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Bölümler"
      className="mobile-float fixed right-1 top-1/2 z-[9] flex -translate-y-1/2 flex-col md:hidden"
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          aria-label={s.label}
          aria-current={active === s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="grid h-7 w-6 cursor-pointer place-items-center border-0 bg-transparent p-0"
        >
          <span
            className={[
              'block w-1.5 rounded-full transition-all duration-300',
              active === s.id ? 'h-5 bg-pink' : 'h-1.5 bg-white/45',
            ].join(' ')}
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.25)' }}
          />
        </button>
      ))}
    </nav>
  );
}
