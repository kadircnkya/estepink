import { useEffect } from 'react';
import { buildWhatsAppUrl } from '../../config/whatsapp';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface StickyCtaProps {
  onClick: () => void;
}

// Mobilde altta her zaman sabit duran Randevu Al + WhatsApp butonları
export function StickyCta({ onClick }: StickyCtaProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cta-h', '52px');
    return () => {
      root.style.removeProperty('--cta-h');
    };
  }, []);

  return (
    <div
      className="mobile-float fixed inset-x-0 bottom-0 z-[10] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-6 pointer-events-none md:hidden"
      style={{ background: 'linear-gradient(to top, rgba(28,12,22,0.9) 30%, rgba(28,12,22,0))' }}
    >
      <div className="flex gap-3">
        <button
          type="button"
          id="sticky-book-btn"
          onClick={onClick}
          className="btn-primary pointer-events-auto flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 border-0 text-[15px] font-semibold"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15" rx="3" />
            <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
          </svg>
          Randevu Al
        </button>
        <a
          href={buildWhatsAppUrl('Merhaba, randevu almak istiyorum.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp üzerinden randevu alın"
          className="btn-whatsapp pointer-events-auto h-12 flex-1 gap-2 text-[15px] no-underline"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
