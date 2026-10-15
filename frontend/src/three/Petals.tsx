import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  ShaderMaterial,
  Vector2,
  type PerspectiveCamera,
  type Points,
} from 'three';
import { PETALS } from '../lib/config';
import { smoothstep } from '../lib/math';
import { useMotion } from '../lib/motion';
import { introProgress } from '../lib/timeline';
import { petalsFragment, petalsVertex } from './shaders/petals';

interface PetalsProps {
  coarse: boolean;
  reduced: boolean;
}

// 3D süzülen taç yapraklar
export function Petals({ coarse, reduced }: PetalsProps) {
  const m = useMotion();
  const points = useRef<Points>(null);
  const count = coarse ? PETALS.countCoarse : PETALS.count;

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aS', new BufferAttribute(seeds, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uT: { value: 0 },
      uPR: { value: 1 },
      uO: { value: 0 },
      uHalf: { value: new Vector2(1, 1) },
      uPtr: { value: new Vector2(9, 9) },
    }),
    [],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms,
        vertexShader: petalsVertex,
        fragmentShader: petalsFragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ camera, size, gl }) => {
    const p = points.current;
    if (!p) return;
    if (reduced) {
      p.visible = false;
      return;
    }
    const cam = camera as PerspectiveCamera;
    const now = performance.now();
    const ip = introProgress(m.introStart, now, reduced);

    // Görünür alan sınırları
    const h = 2 * Math.abs(PETALS.z) * Math.tan(MathUtils.degToRad(cam.fov / 2));
    uniforms.uHalf.value.set((h * (size.width / size.height)) / 2, h / 2);

    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const fadeOutThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600;
    const heroFade = Math.max(0, 1 - scrollY / Math.max(1, fadeOutThreshold));
    // Yaprakların yumuşak görünürlük oranı
    const o = (0.55 + 0.45 * heroFade) * smoothstep(0.4, 1, ip);

    uniforms.uT.value = now / 1000;
    uniforms.uPR.value = gl.getPixelRatio();
    uniforms.uO.value = o;
    uniforms.uPtr.value.set(0, 0);
    p.visible = o > 0.01;
  });

  return (
    <points
      ref={points}
      geometry={geometry}
      material={material}
      position={[0, 0, PETALS.z]}
      frustumCulled={false}
      renderOrder={9}
    />
  );
}
