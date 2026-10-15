import { useEffect, useState } from 'react';

interface StickyCtaProps {
  onClick: () => void;
}

// Mobilde altta sabit duran Randevu Al butonu
export function StickyCta({ onClick }: StickyCtaProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById('iletisim');
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setVisible(!(e && e.intersectionRatio > 0.4)), {
      threshold: [0, 0.4, 0.7],
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cta-h', visible ? '52px' : '0px');
    return () => {
      root.style.removeProperty('--cta-h');
    };
  }, [visible]);

  return (
    <div
      aria-hidden={!visible}
      className={[
        'mobile-float fixed inset-x-0 bottom-0 z-[10] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-6',
        'pointer-events-none transition-transform duration-300 md:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
      style={{ background: 'linear-gradient(to top, rgba(28,12,22,0.9) 30%, rgba(28,12,22,0))' }}
    >
      <button
        type="button"
        id="sticky-book-btn"
        onClick={onClick}
        tabIndex={visible ? 0 : -1}
        className="btn-primary pointer-events-auto flex h-12 w-full cursor-pointer items-center justify-center gap-2 border-0 text-[15px] font-semibold"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="3" />
          <path d="M8 3v4M16 3v4M3.5 10h17" strokeLinecap="round" />
        </svg>
        Randevu Al
      </button>
    </div>
  );
}
