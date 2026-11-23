import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SERVICE_CATEGORIES, type ServiceCategory } from '../content/serviceCategories';
import { getServiceWhatsAppUrl } from '../content/site';

interface ServiceCategoriesProps {
  onRequest: (serviceTitle?: string) => void;
}

// Hizmetler: kategori kartları (masaüstünde 3 sütun, tabletta 2, mobilde 1)
export function ServiceCategories({ onRequest }: ServiceCategoriesProps) {
  const uid = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string[]>([]);

  // Scroll ile kartları sırayla belirginleştir
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>('.svc-card, .svc-head');
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <section
      id="hizmetler"
      ref={sectionRef}
      aria-labelledby={`${uid}-title`}
      className="snap-section relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24 md:py-32"
    >
      <header className="svc-head max-w-2xl">
        <span className="eyebrow">Hizmetlerimiz</span>
        <h2 id={`${uid}-title`} className="section-title mt-5">
          Size özel <i>bakım</i> ritüelleri.
        </h2>
      </header>

      <ul className="svc-grid m-0 mt-10 grid list-none grid-cols-1 items-start gap-4 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {SERVICE_CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            index={i}
            uid={uid}
            isOpen={open.includes(cat.id)}
            onToggle={() =>
              setOpen((o) => (o.includes(cat.id) ? o.filter((x) => x !== cat.id) : [...o, cat.id]))
            }
            onHoverOpen={() => canHover() && setOpen([cat.id])}
            onRequest={() => onRequest(cat.title)}
          />
        ))}
      </ul>
    </section>
  );
}

interface CardProps {
  cat: ServiceCategory;
  index: number;
  uid: string;
  isOpen: boolean;
  onToggle: () => void;
  onHoverOpen: () => void;
  onRequest: () => void;
}

function CategoryCard({ cat, index, uid, isOpen, onToggle, onHoverOpen, onRequest }: CardProps) {
  const panelId = `${uid}-${cat.id}-panel`;
  const btnId = `${uid}-${cat.id}-btn`;

  return (
    <li
      className={['svc-card', isOpen ? 'is-open' : ''].join(' ')}
      style={{ '--i': index } as CSSProperties}
      onMouseEnter={onHoverOpen}
    >
      <h3 className="m-0">
        <button
          id={btnId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-5 text-left sm:p-6"
        >
          <span className="w-8 shrink-0 font-serif text-[16px] italic text-pink">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex-1 font-serif text-[clamp(24px,2.4vw,30px)] leading-[1.1] text-ink">{cat.title}</span>
          <span
            aria-hidden="true"
            className={[
              'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
              isOpen ? 'border-pink bg-pink-fill text-white' : 'hairline text-ink',
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
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            {cat.items && <ServiceList items={cat.items} />}
            {cat.groups?.map((g) => (
              <div key={g.label} className="svc-group">
                <p className="svc-group-label">{g.label}</p>
                <ServiceList items={g.items} />
              </div>
            ))}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onRequest} className="btn-primary flex-1 cursor-pointer border-0">
                Randevu Al
              </button>
              <a
                href={getServiceWhatsAppUrl(cat.title)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${cat.title} için WhatsApp'tan yazın`}
                className="btn-whatsapp flex-1 no-underline"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ServiceList({ items }: { items: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {items.map((name) => (
        <li key={name} className="flex items-start gap-3 text-[15px] leading-snug text-ink/90">
          <svg viewBox="0 0 16 16" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-pink" aria-hidden="true">
            <path
              d="M8 1.5l1.7 4.3 4.3 1.7-4.3 1.7L8 13.5 6.3 9.2 2 7.5l4.3-1.7z"
              fill="currentColor"
            />
          </svg>
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

