import React from 'react';
import type { BookSpread } from '../../content/book';
import { LINKS } from '../../content/copy';

interface TextPageProps {
  spread: BookSpread;
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

export const TextPage: React.FC<TextPageProps> = ({ spread }) => {
  return (
    <div className="relative h-full w-full flex flex-col justify-between p-2.5 sm:p-5 md:p-8 lg:p-11 text-ink overflow-hidden">
      {/* Top section: Tag, Title & Body */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Tag & line */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <span className="font-sans text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-[0.16em] text-pink uppercase truncate">
            {spread.tag}
          </span>
          <div className="h-px flex-1 bg-pink/20" />
        </div>

        {/* Title */}
        <h2 className="font-serif text-[clamp(13px,3vw,34px)] leading-[1.1] tracking-tight text-ink mt-0.5 mb-1 sm:mb-2.5">
          <RichTitle text={spread.title} />
        </h2>

        {/* Body text */}
        <p className="font-sans text-[clamp(10px,1.9vw,15.5px)] leading-[1.4] sm:leading-relaxed text-[#7a5566] max-w-[44ch] line-clamp-4 sm:line-clamp-none">
          {spread.body}
        </p>

        {/* Spread 9: Booking CTA */}
        {spread.isBooking && (
          <div className="mt-2 sm:mt-4 flex flex-col gap-1.5 sm:gap-2.5">
            <a
              id="book-whatsapp-btn"
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'inline-flex items-center justify-center gap-1.5 rounded-full bg-pink',
                'px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-6 md:py-3',
                'font-sans text-[10px] sm:text-xs md:text-sm font-semibold text-white no-underline shadow-[0_3px_10px_rgba(232,36,111,0.3)]',
                'transition-all duration-200 hover:bg-[#d81b60] hover:scale-[1.02] active:scale-[0.98]',
                'focus-visible:outline-2 focus-visible:outline-pink focus-visible:outline-offset-2',
              ].join(' ')}
            >
              <span>WhatsApp ile randevu al</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.92-9.91-9.92z" />
              </svg>
            </a>

            <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-ink/70">
              <span>Instagram:</span>
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-pink hover:underline"
              >
                {LINKS.instagramHandle}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section: Page number & branding footer */}
      <div className="mt-1 pt-1 sm:mt-2 sm:pt-2 border-t border-pink/10 flex items-center justify-between text-[9px] sm:text-xs text-ink/40 font-sans">
        <span className="truncate">Estepink Defter</span>
        <span className="font-serif italic text-[10px] sm:text-sm text-pink/80 font-medium ml-1">
          {spread.pageNumber}
        </span>
      </div>
    </div>
  );
};
