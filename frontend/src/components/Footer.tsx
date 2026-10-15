import React from 'react';
import { ASSETS } from '../assets';
import { LINKS } from '../content/copy';
import { CONTACT } from '../content/site';

const EXPLORE = [
  { href: '#defter', label: 'Salon & Odalar' },
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#iletisim', label: 'İletişim' },
] as const;

export const Footer: React.FC = () => {
  return (
    <footer className="snap-end-section relative w-full px-4 pb-20 pt-6 sm:px-8 sm:pb-12 sm:pt-20">
      <div className="hairline mx-auto max-w-7xl border-t pt-5 sm:pt-16">
        <div className="grid grid-cols-1 gap-y-5 md:grid-cols-12 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img
              src={ASSETS.logo}
              alt="Estepink"
              width={120}
              height={38}
              loading="lazy"
              className="h-8 w-auto object-contain sm:h-10"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="hidden font-serif text-[21px] leading-snug text-ink sm:mt-6 sm:block sm:text-[26px]">
              Şehrin kalbinde, <i className="text-pink">pembe</i> bir deneyim.
            </p>
          </div>

          <FooterCol title="Keşfet" className="md:col-span-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 sm:flex-col sm:gap-3">
              {EXPLORE.map((l) => (
                <li key={l.href} className="list-none">
                  <a href={l.href} className="footer-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </div>
          </FooterCol>

          <FooterCol title="İletişim" className="md:col-span-3">
            <li className="text-[13px] text-muted sm:text-[15px]">
              {CONTACT.address.line1}, {CONTACT.address.line2}
            </li>
            <li className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={`tel:${CONTACT.phoneHref}`} className="footer-link">
                {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="footer-link hidden sm:inline">
                {CONTACT.email}
              </a>
            </li>
          </FooterCol>

          {/* Mobilde sağ altta sabit Instagram ve WhatsApp butonları olduğu için bu sütun mobilde gizlendi */}
          <FooterCol title="Takip edin" className="hidden md:col-span-2 md:block">
            <li>
              <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="footer-link">
                Instagram
              </a>
            </li>
            <li>
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-link">
                WhatsApp
              </a>
            </li>
          </FooterCol>
        </div>

        <div className="hairline mt-5 flex flex-col items-center justify-center gap-2 border-t pt-4 text-center text-[12px] text-muted sm:mt-16 sm:gap-4 sm:pt-8 sm:text-[13px]">
          <span>© {new Date().getFullYear()} Estepink Güzellik &amp; Epilasyon. Tüm hakları saklıdır.</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-muted transition-colors hover:text-ink"
          >
            Yukarı dön
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5"
              aria-hidden="true"
            >
              <path d="M8 13V3M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h2 className="m-0 text-[12px] font-medium uppercase tracking-[0.18em] text-muted">{title}</h2>
      <ul className="mt-3 flex list-none flex-col gap-1.5 p-0 text-[14px] leading-relaxed sm:mt-5 sm:gap-3 sm:text-[15px]">{children}</ul>
    </div>
  );
}
