import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BOOK_SPREADS } from '../../content/book';
import { Leaf } from './Leaf';
import { PhotoPage } from './PhotoPage';
import { TextPage } from './TextPage';
import { BookControls } from './BookControls';
import { playPageFlipSound } from '../../lib/audio';

interface BookProps {
  currentSpread?: number;
  onSpreadChange?: (index: number) => void;
  reducedMotion?: boolean;
}

export const Book: React.FC<BookProps> = ({
  currentSpread: controlledSpread,
  onSpreadChange,
  reducedMotion = false,
}) => {
  const [internalSpread, setInternalSpread] = useState(0);
  const activeSpread = controlledSpread !== undefined ? controlledSpread : internalSpread;

  const [flippingLeaf, setFlippingLeaf] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync spread changes and play flip sound
  const setSpread = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(BOOK_SPREADS.length - 1, index));
      if (clamped === activeSpread) return;

      if (soundEnabled) {
        playPageFlipSound();
      }

      // Determine which leaf flips
      if (clamped > activeSpread) {
        setFlippingLeaf(activeSpread);
      } else {
        setFlippingLeaf(clamped);
      }

      if (onSpreadChange) {
        onSpreadChange(clamped);
      } else {
        setInternalSpread(clamped);
      }

      // Reset flipping state after animation completes
      const timer = window.setTimeout(() => {
        setFlippingLeaf(null);
      }, 650);

      return () => window.clearTimeout(timer);
    },
    [activeSpread, onSpreadChange, soundEnabled],
  );

  const handlePrev = useCallback(() => {
    if (activeSpread > 0) {
      setSpread(activeSpread - 1);
    }
  }, [activeSpread, setSpread]);

  const handleNext = useCallback(() => {
    if (activeSpread < BOOK_SPREADS.length - 1) {
      setSpread(activeSpread + 1);
    }
  }, [activeSpread, setSpread]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    touchStartRef.current = null;

    if (dx < -35) handleNext();
    else if (dx > 35) handlePrev();
  };

  const totalSpreads = BOOK_SPREADS.length; // 9
  const leavesCount = totalSpreads - 1; // 8 flipping leaves

  return (
    <section
      id="defter"
      aria-label="Estepink Açık Defter Galerisi"
      className="relative w-full flex flex-col items-center justify-center pt-14 pb-6 sm:pt-28 sm:pb-10 md:pt-32 px-2 sm:px-6 select-none"
    >
      {/* Section Header */}
      <div className="mb-6 sm:mb-12 md:mb-14 flex flex-col items-center text-center max-w-xl px-4">
        <span className="eyebrow">Salon & Odalar</span>
        <h2 className="section-title mt-5 mb-4">
          Salonu ve odalarımızı <i>keşfedin</i>.
        </h2>
        <p className="font-sans text-[14px] sm:text-[16px] leading-relaxed text-muted">
          Sayfaları çevirerek salonumuzun huzurlu atmosferini ve odalarımızı yakından inceleyin.
        </p>
      </div>

      {/* Desk surface shadow & 3D open book */}
      <div className="relative w-full flex flex-col items-center">
        {/* Soft elliptical table drop shadow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[1100px] h-10 sm:h-14 rounded-[100%] bg-black/50 blur-2xl pointer-events-none"
        />

        {/* 3D Book Container: ALWAYS side-by-side open book */}
        <div
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-label={`Sayfa ${activeSpread + 1} / ${totalSpreads}`}
          className="theme-paper relative flex flex-row rounded-[6px] sm:rounded-[8px] transition-all duration-300 w-[min(96vw,1140px)] h-[clamp(310px,58vw,660px)]"
          style={{
            perspective: '1800px',
            WebkitPerspective: '1800px',
            backgroundColor: '#fffaf5',
            boxShadow: [
              '0 1px 2px rgba(43,16,32,0.08)',
              '2px 2px 0 #f0e6dc',
              '4px 4px 0 #e6d8cb',
              '6px 6px 0 #ded0bf',
              '0 20px 48px -12px rgba(43,16,32,0.22)',
            ].join(', '),
          }}
        >
          {/* Static Left Base: Photo 1 */}
          <div
            className="absolute top-0 left-0 bottom-0 w-1/2 rounded-l-[6px] overflow-hidden"
            style={{
              zIndex: 5,
              backgroundColor: '#fffaf5',
            }}
          >
            <PhotoPage spread={BOOK_SPREADS[0]!} isPriority={true} />
          </div>

          {/* Static Right Base: Text 9 (Randevu) */}
          <div
            className="absolute top-0 right-0 bottom-0 w-1/2 rounded-r-[6px] overflow-hidden"
            style={{
              zIndex: 5,
              backgroundColor: '#fffaf5',
            }}
          >
            <TextPage spread={BOOK_SPREADS[8]!} />
          </div>

          {/* 8 Flipping Leaves */}
          {Array.from({ length: leavesCount }, (_, k) => {
            const isTurned = k < activeSpread;
            const isFlipping = flippingLeaf === k;

            // Proper stacking z-index
            let zIndex = 10;
            if (isFlipping) {
              zIndex = 50;
            } else if (isTurned) {
              zIndex = 10 + k;
            } else {
              zIndex = 10 + (leavesCount - 1 - k);
            }

            return (
              <Leaf
                key={k}
                leafIndex={k}
                frontSpread={BOOK_SPREADS[k]!}
                backSpread={BOOK_SPREADS[k + 1]!}
                isTurned={isTurned}
                isFlipping={isFlipping}
                zIndex={zIndex}
                reducedMotion={reducedMotion}
              />
            );
          })}

          {/* Center Vertical Spine Overlay */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 sm:w-6 md:w-8 pointer-events-none z-40"
            style={{
              background:
                'linear-gradient(to right, rgba(43,16,32,0.16) 0%, rgba(43,16,32,0.04) 15%, transparent 45%, transparent 55%, rgba(43,16,32,0.04) 85%, rgba(43,16,32,0.16) 100%)',
            }}
          >
            {/* Delicate stitched center line */}
            <div className="absolute left-1/2 top-2 sm:top-4 bottom-2 sm:bottom-4 -translate-x-1/2 border-r border-dashed border-pink/25" />
          </div>
        </div>

        {/* Navigation Controls: Prev / Next / Dots / Sound Toggle */}
        <BookControls
          currentSpread={activeSpread}
          totalSpreads={totalSpreads}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={setSpread}
          disabled={flippingLeaf !== null}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((s) => !s)}
        />
      </div>
    </section>
  );
};
