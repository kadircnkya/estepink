// Kitap sayfası çevirme animasyonu ve gölge efektleri
import React, { useEffect, useRef } from 'react';
import type { BookSpread } from '../../content/book';
import { PhotoPage } from './PhotoPage';
import { TextPage } from './TextPage';

interface LeafProps {
  leafIndex: number;
  frontSpread: BookSpread;
  backSpread: BookSpread;
  isTurned: boolean;
  isFlipping: boolean;
  zIndex: number;
  reducedMotion: boolean;
}

// ─────────────────────────────────────────────────────────────
// Spring configuration
// ─────────────────────────────────────────────────────────────
const STIFFNESS = 240; // yay sertliği
const DAMPING = 28;    // sönümleme
const MASS = 1;

/** Tek adım spring integration (Verlet). Açı derece cinsinden. */
function springStep(
  angle: number,
  velocity: number,
  target: number,
  dt: number,
): [number, number] {
  const force = -STIFFNESS * (angle - target) - DAMPING * velocity;
  const acc = force / MASS;
  const v = velocity + acc * dt;
  const a = angle + v * dt;
  return [a, v];
}

/** Anlık kıvrılma payı: flip ortasındayken maksimum eğim. */
function curvature(progress: number): number {
  // progress 0→1 (sağdan sola). Ortada tepe yapar.
  return Math.sin(progress * Math.PI);
}

export const Leaf: React.FC<LeafProps> = ({
  leafIndex,
  frontSpread,
  backSpread,
  isTurned,
  isFlipping,
  zIndex,
  reducedMotion,
}) => {
  // Anlık açı (derece): 0 = sağ sayfa, -180 = çevrilmiş
  const angleRef = useRef(isTurned ? -180 : 0);
  const velocityRef = useRef(0);
  const rafRef = useRef(0);
  const prevTimeRef = useRef<number | null>(null);

  // React'a görünür arka yüz mi değil mi bilgisini taşı (ekstra render yok)
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const shimRef = useRef<HTMLDivElement>(null);
  const shadowFrontRef = useRef<HTMLDivElement>(null);
  const shadowBackRef = useRef<HTMLDivElement>(null);

  // Hangi yüzün göründüğünü backfaceVisibility CSS hallediyor,
  // ayrıca React state'e gerek yok — direkt DOM yazıyoruz.

  useEffect(() => {
    const target = isTurned ? -180 : 0;

    // ── Reduced motion: anında geç ──────────────────────────
    if (reducedMotion) {
      angleRef.current = target;
      velocityRef.current = 0;
      applyTransform(target, 0, target);
      return;
    }

    // ── Animasyon döngüsü ────────────────────────────────────
    cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;

    const animate = (now: number) => {
      const dt = Math.min((now - (prevTimeRef.current ?? now)) / 1000, 0.05);
      prevTimeRef.current = now;

      const [newAngle, newVel] = springStep(
        angleRef.current,
        velocityRef.current,
        target,
        dt,
      );
      angleRef.current = newAngle;
      velocityRef.current = newVel;

      applyTransform(newAngle, newVel, target);

      // Yarı yolda: yüz değişimi backfaceVisibility ile CSS hallediyor.
      // setShowBack çağrısına gerek yok.

      // Yerleştiyse dur
      if (Math.abs(newAngle - target) < 0.08 && Math.abs(newVel) < 0.1) {
        angleRef.current = target;
        velocityRef.current = 0;
        applyTransform(target, 0, target);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurned, reducedMotion]);

  /** DOM'u doğrudan güncelle — React state kullanmıyoruz, sürtünmesiz. */
  function applyTransform(angle: number, _velocity: number, _target: number) {
    const container = containerRef.current;
    if (!container) return;

    // 0..1 arası ilerleme (0 = sağda, 1 = çevrilmiş)
    const progress = Math.max(0, Math.min(1, Math.abs(angle) / 180));
    const curve = curvature(progress); // 0→1→0

    // Skew: sayfa ortasında kıvrılma hissi
    const skew = curve * 8; // max 8 derece

    // ScaleX: sayfanın "katlanması" — ama çok az ki içerik okunabilsin
    const scaleX = 1 - curve * 0.04;

    container.style.transform = `rotateY(${angle}deg) skewY(${angle < 0 ? -skew : skew
      }deg) scaleX(${scaleX})`;

    // Gölge: dönme yönüne göre sola ya da sağa düşer
    const shadowIntensity = curve * 0.55;
    if (shadowFrontRef.current) {
      shadowFrontRef.current.style.opacity = String(
        progress < 0.5 ? shadowIntensity : 0,
      );
    }
    if (shadowBackRef.current) {
      shadowBackRef.current.style.opacity = String(
        progress >= 0.5 ? shadowIntensity : 0,
      );
    }

    // Parıltı: sayfa orta noktasında kağıt yansıması
    const shim = shimRef.current;
    if (shim) {
      const shimOpacity = curve * 0.22;
      shim.style.opacity = String(shimOpacity);
    }
  }

  return (
    <div
      aria-hidden={!isFlipping && isTurned ? 'true' : undefined}
      className="absolute top-0 right-0 bottom-0 w-1/2 select-none pointer-events-auto"
      style={{
        zIndex,
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d' as never,
        willChange: isFlipping ? 'transform' : 'auto',
      }}
      ref={containerRef}
    >
      {/* ── FRONT FACE: sağ sayfa (çevrilmeden önce) ── */}
      <div
        ref={frontRef}
        className="absolute inset-0 h-full w-full rounded-r-[6px] overflow-hidden"
        style={{
          backgroundColor: '#fffaf5',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden' as never,
          // Görünürlük showBack'e göre; ama backfaceVisibility zaten halleder
        }}
      >
        <TextPage spread={frontSpread} />

        {/* Spine tarafı derin gölge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(43,16,32,0.22) 0%, transparent 18%)',
          }}
        />

        {/* Dinamik döngü gölgesi (ön) */}
        <div
          aria-hidden="true"
          ref={shadowFrontRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 40%, transparent 75%)',
            transition: 'opacity 40ms linear',
          }}
        />
      </div>

      {/* ── BACK FACE: sol sayfa (çevrildikten sonra) ── */}
      <div
        ref={backRef}
        className="absolute inset-0 h-full w-full rounded-l-[6px] overflow-hidden"
        style={{
          backgroundColor: '#fffaf5',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden' as never,
          transform: 'rotateY(180deg)',
          WebkitTransform: 'rotateY(180deg)' as never,
        }}
      >
        <PhotoPage spread={backSpread} isPriority={leafIndex <= 1} />

        {/* Dinamik döngü gölgesi (arka) */}
        <div
          aria-hidden="true"
          ref={shadowBackRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 40%, transparent 75%)',
            transition: 'opacity 40ms linear',
          }}
        />
      </div>

      {/* ── PARILTMA ŞERİDİ — sadece flip ortasında görünür ── */}
      <div
        aria-hidden="true"
        ref={shimRef}
        className="pointer-events-none absolute inset-0 rounded-[6px]"
        style={{
          opacity: 0,
          // Kağıt kenarından geçen beyaz ışık şeridi
          background:
            'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.85) 50%, transparent 70%)',
        }}
      />
    </div>
  );
};
