import React from 'react';
import type { BookSpread } from '../../content/book';

interface PhotoPageProps {
  spread: BookSpread;
  isPriority?: boolean;
}

export const PhotoPage: React.FC<PhotoPageProps> = ({ spread, isPriority = false }) => {
  return (
    <div className="relative h-full w-full overflow-hidden select-none group">
      {/* Full-bleed photo covering the entire left page */}
      <img
        src={spread.image}
        alt={spread.alt}
        loading={isPriority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          objectPosition: `${spread.focus.x}% ${spread.focus.y}%`,
        }}
      />

      {/* Subtle edge shading to feel physically embedded into the page and spine */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(43,16,32,0.18)]"
      />

      {/* Floating page pill */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/90 px-2 py-0.5 sm:px-3 sm:py-1 shadow-[0_2px_8px_rgba(43,16,32,0.12)]">
        <span className="font-sans text-[9px] sm:text-[11px] font-semibold tracking-wider text-pink uppercase truncate max-w-[80px] sm:max-w-none">
          {spread.tag.split('—')[1]?.trim() || 'Estepink'}
        </span>
        <span className="text-ink/25">•</span>
        <span className="font-serif italic text-[10px] sm:text-xs text-ink/70 font-medium">
          {spread.pageNumber}
        </span>
      </div>
    </div>
  );
};
