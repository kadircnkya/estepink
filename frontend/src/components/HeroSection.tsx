import React from 'react';
import { HERO_COPY } from '../content/copy';

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
      {/* Hero Glass Card */}
      <div className="pointer-events-auto glass relative max-w-[min(620px,94vw)] rounded-[28px] p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(43,16,32,0.14),inset_0_0_0_1px_rgba(255,255,255,0.7)]">
        {/* Rose-gold accent bar */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[28px]"
          style={{
            background: 'linear-gradient(180deg, #e8a0aa 0%, #e8246f 40%, #c0447e 100%)',
          }}
        />

        {/* Eyebrow */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-sans text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-pink uppercase">
            Estepink Güzellik & Epilasyon
          </span>
          <div className="h-px flex-1 bg-pink/20" />
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-[clamp(32px,6.5vw,56px)] leading-[1.04] tracking-tight text-ink mb-4">
          <RichTitle text={HERO_COPY.title} />
        </h1>

        {/* Body */}
        <p className="font-sans text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-[#7a5566] max-w-[48ch] mb-6">
          {HERO_COPY.body}
        </p>

        {/* Service badges */}
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

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onPlayVideo}
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
        </div>
      </div>
    </section>
  );
};
