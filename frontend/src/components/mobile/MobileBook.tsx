import { useCallback, useEffect, useRef, useState } from 'react';
import { BOOK_SPREADS } from '../../content/book';
import { LINKS } from '../../content/copy';

interface MobileBookProps {
  currentSpread?: number;
  onSpreadChange?: (index: number) => void;
}

function RichTitle({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <i key={i} className="font-serif font-normal text-pink">
            {p}
          </i>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// Mobilde yatay kaydırılabilir galeri kartları
export function MobileBook({ currentSpread = 0, onSpreadChange }: MobileBookProps) {
  const total = BOOK_SPREADS.length;
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(currentSpread);
  const lockUntil = useRef(0);
  const userAt = useRef(0);
  const raf = useRef(0);

  const goTo = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    lockUntil.current = performance.now() + 700;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setActive(i);
  }, []);

  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = scroller.current;
      if (!el) return;
      const idx = Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)));
      setActive(idx);
      if (performance.now() > lockUntil.current) {
        userAt.current = performance.now();
        if (idx !== currentSpread) onSpreadChange?.(idx);
      }
    });
  };

  // Sayfa değişince ilgili slayta kaydır
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (performance.now() - userAt.current < 300) return;
    const visible = Math.round(el.scrollLeft / el.clientWidth);
    if (visible !== currentSpread) goTo(currentSpread);
  }, [currentSpread, goTo]);

  return (
    <section
      id="defter"
      aria-label="Estepink Galerisi"
      className="snap-section relative flex h-[100svh] flex-col pb-[calc(84px+env(safe-area-inset-bottom,0px))] pt-[76px] select-none"
    >
      <div className="px-5 pb-3 text-center">
        <span className="eyebrow">Salon &amp; Odalar</span>
        <h2 className="section-title mt-3 !text-[28px]">
          Salonu <i>keşfedin</i>.
        </h2>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="hide-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        role="region"
        aria-roledescription="carousel"
        aria-label={`Sayfa ${active + 1} / ${total}`}
      >
        {BOOK_SPREADS.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${total}`}
            className="flex h-full w-full shrink-0 snap-center px-4"
          >
            <article
              className={[
                'theme-paper flex w-full flex-col overflow-hidden rounded-[22px] shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)]',
                'transition-[transform,opacity] duration-500 ease-out',
                i === active ? 'scale-100 opacity-100' : 'scale-[0.93] opacity-60',
              ].join(' ')}
            >
              <div className="relative min-h-0 flex-[11]">
                <img
                  src={s.image}
                  alt={s.alt}
                  loading={i <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${s.focus.x}% ${s.focus.y}%` }}
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-pink shadow">
                  {s.tag.split('—')[1]?.trim() ?? 'Estepink'}
                </span>
              </div>
              <div className="flex min-h-0 flex-[9] flex-col justify-center gap-2 px-5 py-4">
                <h3 className="m-0 font-serif text-[clamp(21px,6vw,26px)] font-normal leading-[1.12] text-ink">
                  <RichTitle text={s.title} />
                </h3>
                <p className="m-0 line-clamp-3 text-[15px] leading-relaxed text-[#7a5566]">{s.body}</p>
                {s.isBooking && (
                  <a
                    href={LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-[46px] items-center justify-center rounded-full bg-pink-fill px-5 font-sans text-[14px] font-semibold text-white no-underline active:scale-95"
                  >
                    WhatsApp ile randevu al
                  </a>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>

      {/* Sayfa geçiş butonları */}
      <div className="mt-3 flex items-center justify-center gap-4 px-4">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Önceki sayfa"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-ink active:scale-90 disabled:opacity-30"
        >
          <Chevron flip />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {BOOK_SPREADS.map((s, i) => (
            <span
              key={s.id}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i === active ? 'w-5 bg-pink' : 'w-1.5 bg-white/25',
              ].join(' ')}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(Math.min(total - 1, active + 1))}
          disabled={active === total - 1}
          aria-label="Sonraki sayfa"
          className="grid h-11 w-11 place-items-center rounded-full border border-pink bg-pink-fill text-white active:scale-90 disabled:opacity-30"
        >
          <Chevron />
        </button>
      </div>
    </section>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
