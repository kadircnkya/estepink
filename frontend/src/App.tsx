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

// Hareket ve scroll durumu store'u
const motionStore = createMotion();

export default function App() {
  const { coarse, reduced, dark } = useMediaFlags();
  const isMobile = useIsMobile();

  // Arka plan rengi
  const [bg, setBg] = useState(() =>
    typeof window !== 'undefined' ? readCssBg() : '#fbeef1',
  );
  useEffect(() => {
    setBg(readCssBg());
  }, [dark]);

  // Sayfa yüklenme durumu
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // WebGL context kontrolü
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  // Tanıtım videosu modalı
  const [videoOpen, setVideoOpen] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  // Fare / dokunmatik takibi
  usePointer(motionStore);

  // Aktif defter sayfası
  const [bookSpread, setBookSpread] = useState(0);

  // Hizmetlerden seçilen paket
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

  // Menü yönlendirmeleri
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-pink focus:px-4 focus:py-2 focus:text-white"
      >
        İçeriğe geç
      </a>

      {/* Yükleme ekranı */}
      <Loader done={ready} />

      {/* 3D WebGL arka planı */}
      {!contextLost && (
        <Scene
          coarse={coarse}
          reduced={reduced}
          bg={bg}
          onReady={handleReady}
          onContextLost={handleContextLost}
        />
      )}

      {/* WebGL çalışmazsa yedek arka plan */}
      {contextLost && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: NIGHT_BG }}
        />
      )}

      <NightBackdrop />

      {/* Üst menü ve ilerleme çubuğu */}
      <Header onNavigate={handleNavigate} />
      <ProgressBar />

      <main id="main-content" className="relative z-[2] w-full min-h-screen pt-0 md:pt-20">
        {/* Giriş bölümü */}
        <HeroSection onPlayVideo={openVideo} />

        <div className="theme-night">
          {isMobile ? (
            <>
              {/* Mobil görünüm: tam ekran kaydırmalı bölümler */}
              <MobileBook currentSpread={bookSpread} onSpreadChange={setBookSpread} />
              <MobileServices onRequest={handleServiceRequest} />
              <MobileContact presetService={presetService} />
            </>
          ) : (
            <>
              {/* Masaüstü görünüm */}
              <Book
                currentSpread={bookSpread}
                onSpreadChange={setBookSpread}
                reducedMotion={reduced}
              />
              <Services onRequest={handleServiceRequest} />
              <Contact presetService={presetService} />
            </>
          )}

          <Footer />
        </div>
      </main>

      {/* WhatsApp ve Instagram butonları */}
      <WhatsAppButton />

      {/* Mobilde sabit buton ve sayfa göstergesi */}
      {isMobile && (
        <>
          <SectionDots />
          <StickyCta onClick={() => scrollToId('iletisim')} />
        </>
      )}

      {/* Video penceresi */}
      <VideoModal
        open={videoOpen}
        onClose={closeVideo}
        triggerRef={playBtnRef}
      />
    </MotionContext.Provider>
  );
}
