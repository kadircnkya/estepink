import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, createPortal, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Color, SRGBColorSpace, TextureLoader, type PerspectiveCamera } from 'three';
import { ASSETS } from '../assets';
import { CAMERA } from '../lib/config';
import { useMotion } from '../lib/motion';
import { fovFor } from '../lib/timeline';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useStableViewport } from '../hooks/useStableViewport';
import { NIGHT_BG, nightProgress } from '../lib/night';
import { HeroPlane } from './HeroPlane';
import { Petals } from './Petals';

const TEXTURE_URLS: string[] = [ASSETS.hero, ASSETS.poster];
const MAX_ANISOTROPY = 4;

interface SceneFlags {
  coarse: boolean;
  reduced: boolean;
  bg: string;
}

interface SceneProps extends SceneFlags {
  onReady: () => void;
  onContextLost: () => void;
}

/** Fixed, aria-hidden WebGL layer behind the content. */
export default function Scene({ coarse, reduced, bg, onReady, onContextLost }: SceneProps) {
  const vp = useStableViewport(coarse);
  const lostRef = useRef(onContextLost);
  lostRef.current = onContextLost;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0"
      style={{ width: vp.width, height: vp.height }}
    >
      <Canvas
        flat
        frameloop="demand"
        dpr={[1, coarse ? CAMERA.dprMaxCoarse : CAMERA.dprMax]}
        gl={{
          // The hero is a textured plane and soft petals: MSAA is wasted fill-rate on phones.
          antialias: !coarse,
          alpha: false,
          stencil: false,
          depth: false,
          powerPreference: coarse ? 'default' : 'high-performance',
        }}
        camera={{
          fov: fovFor(vp.width / vp.height),
          near: CAMERA.near,
          far: CAMERA.far,
          position: [0, 0, 4],
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault();
              lostRef.current();
            },
            { once: true },
          );
        }}
      >
        <SceneSetup bg={bg} />
        <FrameTicker fps={coarse ? 30 : 60} />
        <ScrollDriver coarse={coarse} reduced={reduced} />
        <Suspense fallback={null}>
          <World coarse={coarse} reduced={reduced} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/** Clear color blends from CSS --bg (hero) to night plum (rest of page). */
function SceneSetup({ bg }: { bg: string }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);

  const from = useMemo(() => new Color(bg), [bg]);
  const to = useMemo(() => new Color(NIGHT_BG), []);
  const mixed = useMemo(() => new Color(), []);
  const last = useRef(-1);

  useLayoutEffect(() => {
    last.current = -1;
  }, [bg]);

  useFrame(() => {
    const t = nightProgress();
    if (Math.abs(t - last.current) < 0.002) return;
    last.current = t;
    gl.setClearColor(mixed.lerpColors(from, to, t), 1);
  });

  useLayoutEffect(() => {
    camera.aspect = size.width / size.height;
    camera.fov = fovFor(camera.aspect);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useEffect(() => {
    scene.add(camera);
    return () => {
      scene.remove(camera);
    };
  }, [scene, camera]);

  return null;
}

/**
 * Drives the demand frameloop at a capped rate. Pauses entirely while the
 * tab is hidden so background tabs burn no GPU/battery.
 */
function FrameTicker({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const interval = 1000 / fps - 2;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < interval) return;
      last = now;
      invalidate();
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [invalidate, fps]);
  return null;
}

function ScrollDriver({ coarse, reduced }: { coarse: boolean; reduced: boolean }) {
  useScrollProgress(reduced, coarse);
  return null;
}

interface WorldProps {
  coarse: boolean;
  reduced: boolean;
  onReady: () => void;
}

function World({ coarse, reduced, onReady }: WorldProps) {
  const m = useMotion();
  const textures = useLoader(TextureLoader, TEXTURE_URLS);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    const aniso = Math.min(MAX_ANISOTROPY, gl.capabilities.getMaxAnisotropy());
    for (const t of textures) {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = aniso;
      t.needsUpdate = true;
    }
  }, [textures, gl]);

  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  useLayoutEffect(() => {
    m.introStart = performance.now();
    readyRef.current();
  }, [m]);

  useEffect(
    () => () => {
      for (const t of textures) t.dispose();
    },
    [textures],
  );

  const [hero, poster] = textures;
  if (!hero || !poster) return null;

  return (
    <>
      {createPortal(
        <>
          <HeroPlane hero={hero} poster={poster} reduced={reduced} calm={coarse} />
          <Petals coarse={coarse} reduced={reduced} />
        </>,
        camera,
      )}
    </>
  );
}
