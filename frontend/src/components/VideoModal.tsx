import { useRef, useCallback, useEffect } from 'react';
import { ASSETS } from '../assets';
import { UI } from '../content/copy';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  /** ref to the button that opened the modal (focus returns here) */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

/** Full-screen video modal with focus-trap, ESC and backdrop click. */
export function VideoModal({ open, onClose, triggerRef }: VideoModalProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when opened
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      document.body.style.overflow = 'hidden';
      videoRef.current?.play().catch(() => {
        /* user gesture context may be lost, that's fine */
      });
    } else {
      document.body.style.overflow = '';
      videoRef.current?.pause();
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus trap
  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const el = wrapRef.current;
    if (!el) return;
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((f) => !f.hasAttribute('disabled'));
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return (
    <div
      ref={wrapRef}
      id="video-modal"
      role="dialog"
      aria-modal="true"
      aria-label={UI.videoDialog}
      onKeyDown={trapFocus}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={[
        'fixed inset-0 z-[20] flex items-center justify-center',
        'bg-[rgba(14,5,10,0.94)] transition-opacity duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <button
        ref={closeRef}
        id="video-close"
        onClick={onClose}
        aria-label={UI.closeVideo}
        className={[
          'absolute right-4 grid h-[46px] w-[46px] cursor-pointer place-items-center',
          'rounded-full border-0 bg-white/16 font-sans text-2xl text-white',
          'top-[calc(14px+env(safe-area-inset-top,0px))]',
        ].join(' ')}
      >
        &times;
      </button>
      <video
        ref={videoRef}
        id="video-player"
        controls
        playsInline
        preload="none"
        poster={ASSETS.poster}
        aria-label={UI.videoDialog}
        className="max-h-[88vh] max-w-[94vw] rounded-2xl bg-black"
      >
        <source src={ASSETS.video} type="video/mp4" />
        {UI.videoUnsupported}
      </video>
    </div>
  );
}
