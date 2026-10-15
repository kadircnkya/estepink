import { useMemo } from 'react';
import { CONTACT } from '../content/site';
import { LINKS } from '../content/copy';

interface WhatsAppButtonProps {
  /** Optional custom message pre-filled in WhatsApp chat */
  defaultMessage?: string;
}

export function WhatsAppButton({
  defaultMessage = 'Merhaba, Estepink hakkında bilgi ve randevu almak istiyorum.',
}: WhatsAppButtonProps) {
  const whatsappUrl = useMemo(() => {
    const rawNumber = CONTACT.phoneHref.replace(/\D/g, '');
    // Clean any extra formatting just in case
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const encodedText = encodeURIComponent(defaultMessage);
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  }, [defaultMessage]);

  return (
    <aside
      aria-label="Hızlı iletişim"
      className="mobile-float fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px)+var(--cta-h,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px)+var(--cta-h,0px))] sm:right-6 z-50 flex flex-col items-end gap-3 sm:gap-4 transition-[bottom] duration-300"
    >
      {/* Instagram (above WhatsApp) */}
      <div className="group flex items-center">
        <span
          aria-hidden="true"
          className="mr-3 hidden md:inline-block pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rounded-full bg-charcoal/90 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap border border-white/10"
        >
          Instagram'da takip edin
        </span>
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram: ${LINKS.instagramHandle}`}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_8px_25px_rgba(214,36,159,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(214,36,159,0.65)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#d6249f]/40"
          style={{
            background:
              'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
          }}
        >
          {/* Subtle breathing pulse ring */}
          <span
            className="absolute -inset-1 rounded-full bg-[#d6249f]/30 animate-ping pointer-events-none"
            style={{ animationDuration: '3s', animationDelay: '1.5s' }}
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 h-8 w-8 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
          </svg>
        </a>
      </div>

      <div className="group flex items-center">
      {/* Tooltip on hover (desktop) */}
      <span
        aria-hidden="true"
        className="mr-3 hidden md:inline-block pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rounded-full bg-charcoal/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap border border-white/10"
      >
        WhatsApp'tan Yazın
      </span>

      {/* WhatsApp Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden mesaj gönderin"
        className="relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#20ba59] to-[#2ee06e] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.65)] hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle breathing pulse ring */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none"
          style={{ animationDuration: '3s' }}
          aria-hidden="true"
        />

        {/* WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
          aria-hidden="true"
        >
          <path d="M16.01 2.01C8.28 2.01 2 8.29 2 16.02c0 2.59.7 5.09 2.03 7.28L2.08 30l6.93-1.91c2.11 1.2 4.54 1.84 7 1.84 7.73 0 14.01-6.28 14.01-14.01 0-7.73-6.28-14.01-14.01-14.01zm0 25.6c-2.2 0-4.36-.59-6.24-1.71l-.45-.27-4.63 1.27 1.24-4.51-.3-.47c-1.22-1.95-1.87-4.22-1.87-6.53 0-6.75 5.5-12.24 12.25-12.24 6.75 0 12.24 5.49 12.24 12.24 0 6.75-5.49 12.25-12.24 12.25zm6.73-9.18c-.37-.18-2.18-1.08-2.52-1.2-.34-.12-.59-.18-.84.18-.25.37-.96 1.2-1.18 1.45-.22.25-.43.28-.8.09-.37-.18-1.56-.58-2.97-1.84-1.1-0.98-1.84-2.19-2.05-2.56-.22-.37-.02-.57.16-.75.17-.17.37-.43.56-.65.18-.22.25-.37.37-.62.12-.25.06-.46-.03-.65-.09-.18-.84-2.03-1.15-2.78-.3-.73-.61-.63-.84-.64-.22-.01-.46-.01-.71-.01-.25 0-.65.09-.99.46-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.52 3.85.18.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.72-.11 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.09-.15-.34-.24-.71-.43z" />
        </svg>
      </a>
      </div>
    </aside>
  );
}
