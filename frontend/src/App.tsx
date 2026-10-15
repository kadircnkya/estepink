import { useState, useRef, useCallback, useEffect } from 'react';
import { MotionContext, createMotion } from './lib/motion';
import { useMediaFlags, readCssBg } from './hooks/useMediaFlags';
import { usePointer } from './hooks/usePointer';
import type { NavTarget } from './lib/config';
import { NIGHT_BG } from './lib/night';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { Book } from './components/Book/Book';
import { Footer } from './components/Footer';
import { ProgressBar } from './components/ProgressBar';
import { Loader } from './components/Loader';
import { VideoModal } from './components/VideoModal';
import { NightBackdrop } from './components/NightBackdrop';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileBook } from './components/mobile/MobileBook';
import { MobileServices } from './components/mobile/MobileServices';
import { MobileContact } from './components/mobile/MobileContact';
import { StickyCta } from './components/mobile/StickyCta';
import { SectionDots } from './components/mobile/SectionDots';
import { useIsMobile } from './hooks/useIsMobile';
import Scene from './three/Scene';

/** Stable motion store created once per app lifetime. */
const motionStore = createMotion();

export default function App() {
  const { coarse, reduced, dark } = useMediaFlags();
  const isMobile = useIsMobile();

  // Read bg from CSS so the Three.js clear colour always matches
  const [bg, setBg] = useState(() =>
    typeof window !== 'undefined' ? readCssBg() : '#fbeef1',
  );
  useEffect(() => {
    setBg(readCssBg());
  }, [dark]);

  // Loader state — true when textures loaded
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // WebGL context lost fallback
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  // Video modal state
  const [videoOpen, setVideoOpen] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  // Global pointer tracking
  usePointer(motionStore);

  // Active book spread state (0 to 8)
  const [bookSpread, setBookSpread] = useState(0);

  // Service pre-selected from the Services section (nonce re-triggers same title)
  const [presetService, setPresetService] = useState<{ title: string; nonce: number } | null>(null);

  const scrollToId = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleServiceRequest = useCallback(
    (title?: string) => {
      if (title) setPresetService({ title, nonce: Date.now() });
      scrollToId('iletisim');
    },
    [scrollToId],
  );

  // Header navigation mapping
  const handleNavigate = useCallback(
    (target: NavTarget) => {
      const spreads: Partial<Record<NavTarget, number>> = { salon: 0, odalar: 4, cihazlar: 6, randevu: 8 };
      if (target === 'video') {
        openVideo();
      } else if (target === 'hizmetler' || target === 'iletisim') {
        scrollToId(target);
      } else {
        setBookSpread(spreads[target] ?? 0);
        scrollToId('defter');
      }
    },
    [openVideo, scrollToId],
  );

  return (
    <MotionContext.Provider value={motionStore}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-pink focus:px-4 focus:py-2 focus:text-white"
      >
        İçeriğe geç
      </a>

      {/* Loader overlay */}
      <Loader done={ready} />

      {/* Fixed 3-D WebGL canvas behind the content */}
      {!contextLost && (
        <Scene
          coarse={coarse}
          reduced={reduced}
          bg={bg}
          onReady={handleReady}
          onContextLost={handleContextLost}
        />
      )}

      {/* Fallback background if WebGL context is lost */}
      {contextLost && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: NIGHT_BG }}
        />
      )}

      {/* Plum ambience that fades in as the hero fades out */}
      <NightBackdrop />

      {/* Fixed UI Header and Progress bar */}
      <Header onNavigate={handleNavigate} />
      <ProgressBar />

      {/* Natural page flow container */}
      <main id="main-content" className="relative z-[2] w-full min-h-screen pt-0 md:pt-20">
        {/* 1. Hero Section (Includes 'Tanıtım videosunu izle' button which opens VideoModal) */}
        <HeroSection onPlayVideo={openVideo} />

        {/* Everything after the hero lives on the plum "night" backdrop */}
        <div className="theme-night">
          {isMobile ? (
            <>
              {/* Phone: one full-screen section per step, snap-scrolled */}
              <MobileBook currentSpread={bookSpread} onSpreadChange={setBookSpread} />
              <MobileServices onRequest={handleServiceRequest} />
              <MobileContact presetService={presetService} />
            </>
          ) : (
            <>
              {/* 2. Interactive 3D Book Gallery Section */}
              <Book
                currentSpread={bookSpread}
                onSpreadChange={setBookSpread}
                reducedMotion={reduced}
              />

              {/* 3. Services */}
              <Services onRequest={handleServiceRequest} />

              {/* 4. Contact form + map */}
              <Contact presetService={presetService} />
            </>
          )}

          {/* 5. Footer */}
          <Footer />
        </div>
      </main>

      {/* Fixed floating WhatsApp button (bottom-right) */}
      <WhatsAppButton />

      {isMobile && (
        <>
          <SectionDots />
          <StickyCta onClick={() => scrollToId('iletisim')} />
        </>
      )}

      {/* Video modal */}
      <VideoModal
        open={videoOpen}
        onClose={closeVideo}
        triggerRef={playBtnRef}
      />
    </MotionContext.Provider>
  );
}
