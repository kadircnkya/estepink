import React from 'react';
import { HERO_COPY } from '../content/copy';
import { buildWhatsAppUrl } from '../config/whatsapp';

interface HeroSectionProps {
  onPlayVideo: () => void;
}

function RichTitle({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <i key={i} className="font-serif italic text-pink not-italic-fallback font-normal">
            {p}
          </i>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlayVideo }) => {
  return (
    <section
      id="giris"
      aria-label="Giriş Bölümü"
      className="snap-section relative min-h-[100svh] md:min-h-[92svh] flex flex-col justify-end pb-28 md:pb-24 px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Giriş kartı */}
      <div className="pointer-events-auto glass relative max-w-[min(620px,94vw)] rounded-[28px] p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(43,16,32,0.14),inset_0_0_0_1px_rgba(255,255,255,0.7)]">
        {/* Kenar çizgisi */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[28px]"
          style={{
            background: 'linear-gradient(180deg, #e8a0aa 0%, #e8246f 40%, #c0447e 100%)',
          }}
        />

        {/* Üst etiket */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-pink uppercase">
            Estepink Güzellik & Epilasyon
          </span>
          <div className="h-px flex-1 bg-pink/20" />
        </div>

        {/* Ana başlık */}
        <h1 className="font-serif text-[clamp(32px,6.5vw,56px)] leading-[1.04] tracking-tight text-ink mb-4">
          <RichTitle text={HERO_COPY.title} />
        </h1>

        {/* Açıklama */}
        <p className="font-sans text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-[#7a5566] max-w-[48ch] mb-6">
          {HERO_COPY.body}
        </p>

        {/* Hizmet etiketleri */}
        <div className="mb-6 flex flex-wrap gap-2">
          {HERO_COPY.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-pink/30 bg-pink/8 px-3.5 py-1 font-sans text-xs font-medium tracking-wide text-pink"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Butonlar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPlayVideo}
            aria-label="Tanıtım videosunu izleyin"
            className={[
              'flex items-center gap-2 rounded-full bg-pink px-6 py-3',
              'font-sans text-sm font-semibold text-white cursor-pointer',
              'shadow-[0_4px_14px_rgba(232,36,111,0.35)] transition-all duration-200',
              'hover:bg-[#d81b60] hover:scale-105 active:scale-95 hover:shadow-[0_6px_20px_rgba(232,36,111,0.45)]',
              'focus-visible:outline-2 focus-visible:outline-pink focus-visible:outline-offset-2',
            ].join(' ')}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>{HERO_COPY.cta}</span>
          </button>

          <a
            href={buildWhatsAppUrl('Merhaba, randevu almak istiyorum.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp üzerinden hemen randevu alın"
            className={[
              'group flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3',
              'font-sans text-sm font-semibold text-white no-underline',
              'shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-200',
              'hover:bg-[#20ba59] hover:scale-105 active:scale-95 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)]',
              'focus-visible:outline-2 focus-visible:outline-pink focus-visible:outline-offset-2',
            ].join(' ')}
          >
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              className="h-4 w-4 text-white"
              aria-hidden="true"
            >
              <path d="M16.01 2.01C8.28 2.01 2 8.29 2 16.02c0 2.59.7 5.09 2.03 7.28L2.08 30l6.93-1.91c2.11 1.2 4.54 1.84 7 1.84 7.73 0 14.01-6.28 14.01-14.01 0-7.73-6.28-14.01-14.01-14.01zm0 25.6c-2.2 0-4.36-.59-6.24-1.71l-.45-.27-4.63 1.27 1.24-4.51-.3-.47c-1.22-1.95-1.87-4.22-1.87-6.53 0-6.75 5.5-12.24 12.25-12.24 6.75 0 12.24 5.49 12.24 12.24 0 6.75-5.49 12.25-12.24 12.25zm6.73-9.18c-.37-.18-2.18-1.08-2.52-1.2-.34-.12-.59-.18-.84.18-.25.37-.96 1.2-1.18 1.45-.22.25-.43.28-.8.09-.37-.18-1.56-.58-2.97-1.84-1.1-0.98-1.84-2.19-2.05-2.56-.22-.37-.02-.57.16-.75.17-.17.37-.43.56-.65.18-.22.25-.37.37-.62.12-.25.06-.46-.03-.65-.09-.18-.84-2.03-1.15-2.78-.3-.73-.61-.63-.84-.64-.22-.01-.46-.01-.71-.01-.25 0-.65.09-.99.46-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.33 3.6 1.52 3.85.18.25 2.62 4 6.35 5.61.89.38 1.58.61 2.12.78.89.28 1.7.24 2.34.15.72-.11 2.18-.89 2.49-1.75.31-.86.31-1.6.22-1.75-.09-.15-.34-.24-.71-.43z" />
            </svg>
            <span>WhatsApp ile Randevu</span>
          </a>
        </div>
      </div>
    </section>
  );
};
