import { useId, useRef, useState, type CSSProperties } from 'react';
import { SERVICES, getServiceWhatsAppUrl } from '../content/site';
import { useReveal } from '../hooks/useReveal';

/** Services shown per slide. */
const PER_PAGE = 4;
const PAGES: (typeof SERVICES)[number][][] = Array.from(
  { length: Math.ceil(SERVICES.length / PER_PAGE) },
  (_, p) => SERVICES.slice(p * PER_PAGE, (p + 1) * PER_PAGE),
);

interface ServicesProps {
  /** Pre-select a service in the contact form and scroll there. */
  onRequest: (serviceTitle?: string) => void;
}

export function Services({ onRequest }: ServicesProps) {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<string | null>(SERVICES[0]?.id ?? null);
  const [page, setPage] = useState(0);
  const touchX = useRef<number | null>(null);
  const uid = useId();

  const goTo = (p: number) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, p));
    if (next === page) return;
    setPage(next);
    setOpen(PAGES[next]?.[0]?.id ?? null);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start === null || end === undefined) return;
    const dx = end - start;
    if (dx < -50) goTo(page + 1);
    else if (dx > 50) goTo(page - 1);
  };

  return (
    <section
      id="hizmetler"
      ref={ref}
      aria-labelledby={`${uid}-title`}
      className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-8 sm:py-24 md:py-32"
    >
      <div className="grid gap-8 sm:gap-14 lg:grid-cols-12 lg:gap-20">
        {/* ── Intro column ── */}
        <header className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow reveal">Hizmetlerimiz</span>
            <h2 id={`${uid}-title`} className="section-title reveal mt-6" style={{ '--d': '80ms' } as CSSProperties}>
              Size özel <i>bakım</i> ritüelleri.
            </h2>
            <p
              className="reveal mt-6 max-w-[42ch] text-[16px] leading-relaxed text-muted"
              style={{ '--d': '160ms' } as CSSProperties}
            >
              Her uygulama, ücretsiz ön görüşme ve cilt analiziyle başlar. Uzman ekibimiz ihtiyacınıza göre
              kişisel bir plan hazırlar.
            </p>

            <dl
              className="reveal hairline mt-10 grid grid-cols-2 border-t pt-8"
              style={{ '--d': '240ms' } as CSSProperties}
            >
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-muted">Uygulama</dt>
                <dd className="mt-2 font-serif text-[40px] leading-none text-ink">
                  {String(SERVICES.length).padStart(2, '0')}
                </dd>
              </div>
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-muted">Ön görüşme</dt>
                <dd className="mt-2 font-serif text-[40px] leading-none text-ink">
                  <i className="text-pink">Ücretsiz</i>
                </dd>
              </div>
            </dl>

            <div className="reveal mt-10" style={{ '--d': '320ms' } as CSSProperties}>
              <button type="button" onClick={() => onRequest()} className="btn-primary cursor-pointer border-0">
                Randevu talep et
                <Arrow />
              </button>
            </div>
          </div>
        </header>

        {/* ── Service slider ── */}
        <div className="lg:col-span-7" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {PAGES.map((items, pi) => (
                <ol
                  key={pi}
                  aria-hidden={pi !== page}
                  inert={pi === page ? undefined : ''}
                  className="hairline m-0 w-full shrink-0 list-none border-t p-0"
                >
                  {items.map((s, j) => {
                    const i = pi * PER_PAGE + j;
                    const isOpen = open === s.id;
                    const panelId = `${uid}-${s.id}-panel`;
                    const btnId = `${uid}-${s.id}-btn`;
                    return (
                      <li key={s.id} className="hairline border-b">
                        <h3 className="m-0">
                          <button
                            id={btnId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? null : s.id)}
                            className="group flex w-full cursor-pointer items-start gap-5 border-0 bg-transparent py-6 text-left sm:gap-8 sm:py-8"
                          >
                            <span className="w-8 shrink-0 pt-2 font-serif text-[15px] italic text-pink sm:w-10">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1">
                              <span
                                className={[
                                  'block font-serif text-[clamp(24px,3vw,34px)] leading-[1.1] transition-colors duration-300',
                                  isOpen ? 'text-ink' : 'text-ink/80 group-hover:text-ink',
                                ].join(' ')}
                              >
                                {s.title}
                              </span>
                              <span className="mt-2 block max-w-[52ch] text-[15px] leading-relaxed text-muted">
                                {s.summary}
                              </span>
                            </span>
                            <span
                              aria-hidden="true"
                              className={[
                                'relative mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                                isOpen
                                  ? 'border-pink bg-pink-fill text-white'
                                  : 'hairline text-ink group-hover:border-pink',
                              ].join(' ')}
                            >
                              <span className="absolute h-px w-3.5 bg-current" />
                              <span
                                className={[
                                  'absolute h-3.5 w-px bg-current transition-transform duration-300',
                                  isOpen ? 'scale-y-0' : 'scale-y-100',
                                ].join(' ')}
                              />
                            </span>
                          </button>
                        </h3>

                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={btnId}
                          className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                          inert={isOpen ? undefined : ''}
                        >
                          <div className="overflow-hidden">
                            <div className="flex flex-col gap-6 pb-8 pl-[52px] sm:flex-row sm:items-end sm:justify-between sm:pl-[72px]">
                              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                                {s.points.map((p) => (
                                  <li key={p} className="flex items-center gap-3 text-[15px] text-ink/90">
                                    <span aria-hidden="true" className="h-px w-4 bg-pink" />
                                    {p}
                                  </li>
                                ))}
                              </ul>
                              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                                <span className="text-[12px] uppercase tracking-[0.14em] text-muted">
                                  Süre · <span className="text-ink">{s.duration}</span>
                                </span>
                                <a
                                  href={getServiceWhatsAppUrl(s.title)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-ghost cursor-pointer bg-transparent no-underline"
                                >
                                  WhatsApp ile bilgi al
                                  <Arrow />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ))}
            </div>
          </div>

          {/* Slider controls */}
          {PAGES.length > 1 && (
            <nav aria-label="Hizmet sayfaları" className="mt-6 flex items-center justify-between gap-4">
              <span className="text-[12px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
                {page * PER_PAGE + 1}–{Math.min(SERVICES.length, (page + 1) * PER_PAGE)} / {SERVICES.length}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" role="group" aria-label="Sayfa seç">
                  {PAGES.map((_, p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goTo(p)}
                      aria-label={`Sayfa ${p + 1}`}
                      aria-current={p === page}
                      className={[
                        'h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-300',
                        p === page ? 'w-6 bg-pink' : 'w-2 bg-ink/25 hover:bg-ink/50',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo(page - 1)}
                  disabled={page === 0}
                  aria-label="Önceki hizmetler"
                  className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border hairline bg-transparent text-ink transition-all duration-200 hover:border-pink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--line)]"
                >
                  <Arrow flip />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(page + 1)}
                  disabled={page === PAGES.length - 1}
                  aria-label="Sonraki hizmetler"
                  className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-pink bg-pink-fill text-white transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Arrow />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
