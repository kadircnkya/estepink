import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, ShaderMaterial, Vector2, type Mesh, type PerspectiveCamera, type Texture } from 'three';
import { HERO } from '../lib/config';
import { useMotion } from '../lib/motion';
import { easeOutCubic, introProgress, sweepPosition } from '../lib/timeline';
import { heroFragment, heroVertex } from './shaders/hero';

interface HeroPlaneProps {
  hero: Texture;
  poster: Texture;
  reduced: boolean;
  calm?: boolean;
}

// Kamera önündeki 3D hero düzlemi
export function HeroPlane({ hero, poster, reduced, calm = false }: HeroPlaneProps) {
  const m = useMotion();
  const mesh = useRef<Mesh>(null);

  const uniforms = useMemo(
    () => ({
      a: { value: hero },
      b: { value: poster },
      uAsp: { value: 1 },
      uO: { value: 1 },
      uX: { value: 0 },
      uY: { value: 0 },
      uI: { value: 0 },
      uZ: { value: 0 },
      uH: { value: 0 },
      uS: { value: -9 },
      uPt: { value: new Vector2(0.5, 0.5) },
    }),
    [hero, poster],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms,
        vertexShader: heroVertex,
        fragmentShader: heroFragment,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ camera, size }) => {
    const plane = mesh.current;
    if (!plane) return;
    const cam = camera as PerspectiveCamera;
    const now = performance.now();
    const aspect = size.width / size.height;

    // Görünüm alanına göre ölçekleme
    const h = 2 * Math.abs(HERO.z) * Math.tan(MathUtils.degToRad(cam.fov / 2));
    plane.scale.set(h * aspect, h, 1);

    const start = m.introStart;
    const elapsed = start === null ? 0 : (now - start) / 1000;

    // Aşağı kaydırıldıkça yumuşak solma
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const fadeOutThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600;
    const o = Math.max(0, 1 - scrollY / Math.max(1, fadeOutThreshold));

    uniforms.uAsp.value = aspect;
    uniforms.uO.value = o;
    uniforms.uI.value = easeOutCubic(introProgress(start, now, reduced));
    uniforms.uZ.value = 0;
    uniforms.uH.value = 0;
    uniforms.uS.value = calm ? -9 : sweepPosition(elapsed);
    uniforms.uX.value = 0;
    uniforms.uY.value = 0;
    uniforms.uPt.value.set(0.5, 0.5);

    plane.visible = o > 0.01;
  });

  return (
    <mesh ref={mesh} position={[0, 0, HERO.z]} material={material} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
