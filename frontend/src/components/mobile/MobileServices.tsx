import { useEffect, useRef, useState } from 'react';
import { SERVICES, getServiceWhatsAppUrl, type Service } from '../../content/site';

interface MobileServicesProps {
  onRequest: (serviceTitle?: string) => void;
}

// Hizmet kapak görselleri
const COVER: Record<string, string> = {
  'lazer-epilasyon': '/images/g9.webp',
  'cilt-bakimi': '/images/g5.webp',
  hydrafacial: '/images/g4.webp',
  'leke-akne': '/images/g6.webp',
  'bolgesel-incelme': '/images/g8.webp',
  'kirpik-kas': '/images/g3.webp',
};
const FALLBACK_COVER = '/images/g1.webp';

// Mobil için kart geçişli hizmet listesi
export function MobileServices({ onRequest }: MobileServicesProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [idx, setIdx] = useState(0);
  const [sheet, setSheet] = useState<Service | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = scroller.current;
      const card = el?.firstElementChild as HTMLElement | null;
      if (!el || !card) return;
      const step = card.offsetWidth + 12;
      setIdx(Math.max(0, Math.min(SERVICES.length - 1, Math.round(el.scrollLeft / step))));
    });
  };

  const scrollToCard = (i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: i * (card.offsetWidth + 12), behavior: 'smooth' });
  };

  // Detay penceresi açıkken arka plan kaydırmasını kilitle
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [sheet]);

  return (
    <section
      id="hizmetler"
      aria-label="Hizmetlerimiz"
      className="snap-section relative flex min-h-[100svh] flex-col justify-center pb-[calc(92px+env(safe-area-inset-bottom,0px))] pt-[84px]"
    >
      <div className="px-5">
        <span className="eyebrow">Hizmetlerimiz</span>
        <h2 className="section-title mt-3 !text-[30px]">
          Size özel <i>bakım</i> ritüelleri.
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
          Her uygulama <b className="font-medium text-ink">ücretsiz ön görüşmeyle</b> başlar.
        </p>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="hide-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[12vw] pb-2"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hizmet kartları"
      >
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSheet(s)}
            aria-label={`${s.title} — detayları aç`}
            className={[
              'flex w-[76vw] max-w-[330px] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-0 text-left',
              'transition-[transform,opacity] duration-500 ease-out active:scale-[0.97]',
              i === idx ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-70',
            ].join(' ')}
          >
            <img
              src={COVER[s.id] ?? FALLBACK_COVER}
              alt=""
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="h-[24svh] min-h-[130px] w-full object-cover"
            />
            <span className="flex flex-1 flex-col gap-2 p-4">
              <span className="font-serif text-[23px] leading-[1.1] text-ink">{s.title}</span>
              <span className="line-clamp-3 text-[14px] leading-relaxed text-muted">{s.summary}</span>
              <span className="mt-1 flex items-center justify-between text-[12px] uppercase tracking-[0.14em] text-muted">
                <span>{s.duration}</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-pink">
                  Detay
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M4 8h8M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5" role="group" aria-label="Kart seç">
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-label={`${i + 1}. hizmet`}
            aria-current={i === idx}
            className="grid h-6 w-5 cursor-pointer place-items-center border-0 bg-transparent p-0"
          >
            <span
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i === idx ? 'w-5 bg-pink' : 'w-1.5 bg-white/25',
              ].join(' ')}
            />
          </button>
        ))}
      </div>

      {/* Hizmet detay modalı */}
      {sheet && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={sheet.title}>
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setSheet(null)}
            className="sheet-fade absolute inset-0 cursor-default border-0 bg-black/60 p-0"
          />
          <div className="sheet-up theme-night absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[28px] bg-[#241019] px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/25" />
            <div className="flex items-start justify-between gap-4">
              <h3 className="m-0 font-serif text-[30px] font-normal leading-[1.05] text-ink">{sheet.title}</h3>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSheet(null)}
                aria-label="Kapat"
                className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-ink"
              >
                &times;
              </button>
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{sheet.summary}</p>
            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
              {sheet.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-ink">
                  <span aria-hidden="true" className="h-px w-4 bg-pink" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-muted">
              Süre · <span className="text-ink">{sheet.duration}</span>
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  const title = sheet.title;
                  setSheet(null);
                  onRequest(title);
                }}
                className="btn-primary w-full cursor-pointer border-0"
              >
                Bu hizmet için randevu al
              </button>
              <a
                href={getServiceWhatsAppUrl(sheet.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-center no-underline"
              >
                WhatsApp ile bilgi al
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
