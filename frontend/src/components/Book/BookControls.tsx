import React from 'react';

interface BookControlsProps {
  currentSpread: number;
  totalSpreads: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  disabled?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const BookControls: React.FC<BookControlsProps> = ({
  currentSpread,
  totalSpreads,
  onPrev,
  onNext,
  onSelect,
  disabled = false,
  soundEnabled = true,
  onToggleSound,
}) => {
  const isFirst = currentSpread === 0;
  const isLast = currentSpread === totalSpreads - 1;

  const currentFormatted = String(currentSpread + 1).padStart(2, '0');
  const totalFormatted = String(totalSpreads).padStart(2, '0');

  return (
    <nav
      aria-label="Defter sayfa kontrolleri"
      className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none"
    >
      {/* Prev button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst || disabled}
        aria-label="Önceki sayfa"
        className={[
          'group flex h-11 w-11 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full',
          'bg-white/[0.06] text-ink border border-white/10 backdrop-blur-md',
          'transition-all duration-200 hover:bg-pink-fill hover:border-transparent hover:text-white hover:scale-105 active:scale-95',
          'disabled:pointer-events-none disabled:opacity-35',
          'focus-visible:outline-2 focus-visible:outline-pink focus-visible:outline-offset-2',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Page indicator & clickable dot pills */}
      <div className="flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 sm:px-4 sm:py-2 backdrop-blur-md">
        <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-ink/80">
          <span className="text-pink font-bold">{currentFormatted}</span>
          <span className="mx-1 text-ink/30">/</span>
          <span>{totalFormatted}</span>
        </span>

        <div className="hidden sm:flex items-center gap-1.5 ml-1">
          {Array.from({ length: totalSpreads }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              disabled={disabled}
              aria-label={`Sayfa ${i + 1}`}
              aria-current={currentSpread === i ? 'page' : undefined}
              className={[
                'h-2 rounded-full transition-all duration-200 cursor-pointer border-0 p-0',
                currentSpread === i
                  ? 'w-6 bg-pink'
                  : 'w-2 bg-pink/25 hover:bg-pink/60',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isLast || disabled}
        aria-label="Sonraki sayfa"
        className={[
          'group flex h-11 w-11 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full border-0',
          'bg-white/[0.06] text-ink border border-white/10 backdrop-blur-md',
          'transition-all duration-200 hover:bg-pink-fill hover:border-transparent hover:text-white hover:scale-105 active:scale-95',
          'disabled:pointer-events-none disabled:opacity-35',
          'focus-visible:outline-2 focus-visible:outline-pink focus-visible:outline-offset-2',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Sound toggle button */}
      {onToggleSound && (
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Sayfa çevirme sesini kapat' : 'Sayfa çevirme sesini aç'}
          title={soundEnabled ? 'Ses açık' : 'Ses kapalı'}
          className={[
            'flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-white/10',
            soundEnabled
              ? 'bg-pink/15 text-pink hover:bg-pink/25'
              : 'bg-white/[0.06] text-ink/50 hover:bg-white/10',
            'backdrop-blur-md transition-all duration-200',
            'focus-visible:outline-2 focus-visible:outline-pink',
          ].join(' ')}
        >
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      )}
    </nav>
  );
};
