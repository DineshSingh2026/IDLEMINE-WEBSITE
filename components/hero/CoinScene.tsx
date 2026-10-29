"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";

/* ───────────────────────── Geometry constants (world units, coin radius = 1) ───────────────────────── */
const R = 1; // outer radius
const EDGE_H = 0.062; // half-height of the reeded vertical edge
const LIP = 0.088; // half-thickness at the raised rim
const FACE_R = 0.86; // radius of the recessed emblem face
const FACE_Z = 0.05; // half-depth of the recessed face
const SEG = 192;

const MARK_SRC = "/assets/img/idlemine-mark.png";

/** Rim profile (r, y) from the edge, over the bevel and raised lip, down into the face recess. */
function rimProfile(sign: 1 | -1) {
  const pts: Array<[number, number]> = [
    [R, EDGE_H],
    [R - 0.008, EDGE_H + 0.016],
    [R - 0.024, LIP - 0.002],
    [R - 0.045, LIP],
    [0.935, LIP],
    [0.915, LIP - 0.006],
    [0.895, FACE_Z + 0.014],
    [FACE_R + 0.008, FACE_Z + 0.002],
    [FACE_R - 0.004, FACE_Z],
  ];
  return pts.map(([r, y]) => new THREE.Vector2(r, y * sign));
}

/** Reeded-edge bump map: one soft ridge per tile, repeated around the circumference. */
function useReedTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 4;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 32, 0);
    g.addColorStop(0, "#000");
    g.addColorStop(0.5, "#fff");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 4);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(160, 1);
    t.anisotropy = 8;
    return t;
  }, []);
}

/** Composites the emblem on a deep-teal enamel disc at 1024px so the face never shows transparent corners. */
function useFaceTexture(mirror: boolean) {
  const img = useLoader(THREE.ImageLoader, MARK_SRC);
  return useMemo(() => {
    const S = 1024;
    const c = document.createElement("canvas");
    c.width = S;
    c.height = S;
    const ctx = c.getContext("2d")!;
    if (mirror) {
      ctx.translate(S, 0);
      ctx.scale(-1, 1);
    }
    const bg = ctx.createRadialGradient(S * 0.38, S * 0.32, S * 0.05, S / 2, S / 2, S * 0.52);
    bg.addColorStop(0, "#19c3bd");
    bg.addColorStop(0.6, "#0d9894");
    bg.addColorStop(1, "#06595a");
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.imageSmoothingQuality = "high";
    // The mark is a teal circle with the white leaf-flame; draw it slightly inset for a breathing margin.
    const inset = S * 0.06;
    ctx.drawImage(img, inset, inset, S - inset * 2, S - inset * 2);
    // Inner shadow ring for an engraved, inset feel.
    const ring = ctx.createRadialGradient(S / 2, S / 2, S * 0.4, S / 2, S / 2, S / 2);
    ring.addColorStop(0, "rgba(0,0,0,0)");
    ring.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = ring;
    ctx.fillRect(0, 0, S, S);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [img, mirror]);
}

function Coin() {
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const reed = useReedTexture();
  const front = useFaceTexture(false);
  const back = useFaceTexture(true);

  const rimTop = useMemo(() => new THREE.LatheGeometry(rimProfile(1), SEG), []);
  const rimBottom = useMemo(() => new THREE.LatheGeometry(rimProfile(-1), SEG), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (spin.current) spin.current.rotation.y += 0.15 * dt;
    if (tilt.current) {
      const max = THREE.MathUtils.degToRad(8);
      const tx = pointer.current.y * max;
      const ty = pointer.current.x * max;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, tx, 3, dt);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, ty, 3, dt);
      // ±6px float on a 6s cycle (≈0.028 world units at the hero's ~520px canvas).
      tilt.current.position.y = Math.sin((state.clock.elapsedTime / 6) * Math.PI * 2) * 0.028;
    }
  });

  const gold = (
    <meshPhysicalMaterial
      color="#f2bd4b"
      metalness={1}
      roughness={0.24}
      clearcoat={0.35}
      clearcoatRoughness={0.2}
      envMapIntensity={1.25}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group ref={tilt}>
      <group ref={spin} rotation={[0.08, -0.5, 0]}>
        {/* Reeded vertical edge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[R, R, EDGE_H * 2, SEG * 2, 1, true]} />
          <meshPhysicalMaterial
            color="#e9ad3c"
            metalness={1}
            roughness={0.3}
            bumpMap={reed}
            bumpScale={6}
            envMapIntensity={1.1}
          />
        </mesh>
        {/* Beveled rims (front + back) */}
        <mesh geometry={rimTop} rotation={[Math.PI / 2, 0, 0]}>
          {gold}
        </mesh>
        <mesh geometry={rimBottom} rotation={[Math.PI / 2, 0, 0]}>
          {gold}
        </mesh>
        {/* Emblem faces, slightly inset, with a soft emissive teal glow */}
        {(
          [
            { z: FACE_Z, ry: 0, map: front },
            { z: -FACE_Z, ry: Math.PI, map: back },
          ] as const
        ).map((f) => (
          <mesh key={f.z} position={[0, 0, f.z]} rotation={[0, f.ry, 0]}>
            <circleGeometry args={[FACE_R, SEG]} />
            <meshPhysicalMaterial
              map={f.map}
              emissiveMap={f.map}
              emissive="#ffffff"
              emissiveIntensity={0.42}
              metalness={0.15}
              roughness={0.32}
              clearcoat={1}
              clearcoatRoughness={0.12}
              envMapIntensity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    // Wait two frames so the first lit frame is on screen before the fallback fades.
    let a = 0;
    const b = requestAnimationFrame(() => {
      a = requestAnimationFrame(() => onReady?.());
    });
    return () => {
      cancelAnimationFrame(b);
      cancelAnimationFrame(a);
    };
  }, [onReady]);
  return null;
}

/** R3F scene for the $IDLE hero coin. Transparent canvas; pauses rendering when off-screen. */
export default function CoinScene({ onReady, className }: { onReady?: () => void; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 4.4], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <ambientLight intensity={0.15} />
        {/* Gold key light */}
        <pointLight position={[2.4, 2.2, 3.2]} intensity={28} color="#ffd98a" distance={12} decay={2} />
        {/* Solana violet + mint rim lights from below / behind */}
        <pointLight position={[-2.6, -2.2, -1.2]} intensity={40} color="#9945FF" distance={10} decay={2} />
        <pointLight position={[2.6, -2.4, -1]} intensity={30} color="#14F195" distance={10} decay={2} />
        <Suspense fallback={null}>
          <Coin />
          <Environment preset="city" environmentIntensity={0.9}>
            {/* Brand-tinted light cards so the gold catches violet / mint along the bevel */}
            <Lightformer form="rect" intensity={2.4} color="#9945FF" position={[-4, -2, -2]} scale={[4, 6, 1]} />
            <Lightformer form="rect" intensity={2} color="#14F195" position={[4, -2, -2]} scale={[4, 6, 1]} />
            <Lightformer form="ring" intensity={3} color="#ffe08a" position={[0, 4, 3]} scale={3} />
          </Environment>
          <Sparkles count={36} scale={[2.9, 2.9, 1.4]} size={2.2} speed={0.25} opacity={0.7} color="#F5C542" noise={0.6} />
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
