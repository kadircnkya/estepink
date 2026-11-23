import { useState, useRef, useCallback, useEffect, lazy, Suspense } from 'react';
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
import { NightBackdrop } from './components/NightBackdrop';
import { ServiceCategories } from './components/ServiceCategories';
import { Contact } from './components/Contact';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileBook } from './components/mobile/MobileBook';
import { MobileContact } from './components/mobile/MobileContact';
import { StickyCta } from './components/mobile/StickyCta';
import { SectionDots } from './components/mobile/SectionDots';
import { useIsMobile } from './hooks/useIsMobile';

// Ağır parçalar (three.js sahnesi, video penceresi) ihtiyaç anında yüklenir
const Scene = lazy(() => import('./three/Scene'));
const VideoModal = lazy(() => import('./components/VideoModal').then((m) => ({ default: m.VideoModal })));

// Veri tasarrufu açıksa ağır 3D sahne yüklenmez
const SAVE_DATA =
  typeof navigator !== 'undefined' &&
  !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

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
  const [ready, setReady] = useState(SAVE_DATA);
  const handleReady = useCallback(() => setReady(true), []);

  // 3D sahne geç kalırsa veya yüklenemezse yükleme ekranı takılı kalmasın
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  // WebGL context kontrolü
  const [contextLost, setContextLost] = useState(false);
  const handleContextLost = useCallback(() => setContextLost(true), []);

  // Tanıtım videosu modalı
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const openVideo = useCallback(() => {
    setVideoMounted(true);
    setVideoOpen(true);
  }, []);
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
      const spreads: Partial<Record<NavTarget, number>> = { salon: 0, odalar: 3, cihazlar: 5, randevu: 7 };
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
      {!contextLost && !SAVE_DATA && (
        <Suspense fallback={null}>
          <Scene
            coarse={coarse}
            reduced={reduced}
            bg={bg}
            onReady={handleReady}
            onContextLost={handleContextLost}
          />
        </Suspense>
      )}

      {/* WebGL çalışmazsa yedek arka plan */}
      {(contextLost || SAVE_DATA) && (
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
              <ServiceCategories onRequest={handleServiceRequest} />
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
              <ServiceCategories onRequest={handleServiceRequest} />
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

      {/* Video penceresi (ilk açılışta yüklenir) */}
      {videoMounted && (
        <Suspense fallback={null}>
          <VideoModal open={videoOpen} onClose={closeVideo} triggerRef={playBtnRef} />
        </Suspense>
      )}
    </MotionContext.Provider>
  );
}
