"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type HubAsset = { name: string; ticker: string; logo: string };

const MARK = "/assets/img/idlemine-mark.png";

/* ───────── timeline (seconds after the hub scrolls into view) ───────── */
const T_COIN = 0.0; // centre coin pops
const T_PATH = 0.35; // first path starts drawing (centre → asset)
const PATH_STAGGER = 0.09;
const PATH_DUR = 0.95;
const TOKEN_POP = 0.55; // token pop duration, starts as its path lands
const ORBIT_PERIOD = 140; // seconds per revolution
const PARTICLES_IN = 3;
const PARTICLES_OUT = 1;
const TRAIL = 9;

type RGB = [number, number, number];
const hexToRgb = (hex: string, fb: RGB): RGB => {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return fb;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeBack = (x: number) => {
  const t = clamp01(x) - 1;
  return 1 + 2.4 * t * t * t + 1.4 * t * t;
};

/** Pre-rendered glow sprites, tinted along teal → mint. */
function makeSprites(a: RGB, b: RGB, steps = 8, size = 48) {
  return Array.from({ length: steps }, (_, i) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d")!;
    const col = mix(a, b, i / (steps - 1));
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.12, rgba(col, 1));
    grad.addColorStop(0.35, rgba(col, 0.35));
    grad.addColorStop(1, rgba(col, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  });
}

/**
 * Animated "pairing hub": $IDLE at the centre, the tokenized assets orbiting it, each joined by a
 * liquidity path with particles streaming both ways. One canvas draws paths + particles; the
 * tokens are DOM nodes moved with transform/opacity only from the same rAF loop. The loop only
 * runs while the hub is on screen; reduced motion gets a static, fully drawn frame.
 */
export function PairingHub({
  assets,
  pairSuffix,
  active,
  onActive,
}: {
  assets: HubAsset[];
  pairSuffix: string;
  active: string | null;
  onActive: (ticker: string | null) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const tokenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef<string | null>(active);
  activeRef.current = active;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const coin = coinRef.current;
    if (!stage || !canvas || !coin) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const TEAL = hexToRgb(css.getPropertyValue("--teal-400"), [0, 198, 201]);
    const TEAL_D = hexToRgb(css.getPropertyValue("--teal-700"), [1, 128, 130]);
    const MINT = hexToRgb(css.getPropertyValue("--mint"), [61, 245, 176]);
    const sprites = makeSprites(TEAL, MINT);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const n = assets.length;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let rx = 0;
    let ry = 0;
    let coinR = 0;
    let tokR = 0;
    let compact = false;

    const resize = () => {
      const r = stage.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      compact = W < 640;
      cx = W / 2;
      cy = H / 2;
      tokR = compact ? 24 : 38;
      coinR = compact ? 40 : 60;
      rx = compact ? W / 2 - tokR - 14 : Math.min(W * 0.36, 440);
      ry = compact ? H / 2 - tokR - 18 : H / 2 - tokR - 56;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // per-path state
    const glow = new Float32Array(n); // 0..1 eased highlight
    const seeds = Array.from({ length: n }, (_, i) => ({
      speed: 0.16 + ((i * 37) % 11) / 110,
      phase: ((i * 53) % 17) / 17,
      bob: ((i * 29) % 13) / 13 * Math.PI * 2,
    }));
    const pulses: { t0: number; i: number }[] = [];
    const lastU = new Float32Array(n * PARTICLES_IN).fill(-1);

    let orbit = 0;
    let orbitSpeed = (Math.PI * 2) / ORBIT_PERIOD;
    let startAt = -1; // perf-time (s) when entrance began
    let last = 0;
    let raf = 0;
    let running = false;

    const pos = (i: number, time: number) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + orbit;
      const bob = reduced ? 0 : Math.sin(time * 0.9 + seeds[i].bob) * (compact ? 3 : 5);
      const x = cx + Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry + bob;
      const depth = (Math.sin(a) + 1) / 2; // 0 = back (top), 1 = front
      return { x, y, depth, a };
    };

    // Quadratic curve token → centre; control point swung sideways for a vortex feel.
    const curve = (p: { x: number; y: number }) => {
      const mx = (p.x + cx) / 2;
      const my = (p.y + cy) / 2;
      const dx = cx - p.x;
      const dy = cy - p.y;
      const k = 0.24;
      return { x0: p.x, y0: p.y, x1: mx - dy * k, y1: my + dx * k };
    };
    const at = (c: ReturnType<typeof curve>, u: number) => {
      const v = 1 - u;
      return { x: v * v * c.x0 + 2 * v * u * c.x1 + u * u * cx, y: v * v * c.y0 + 2 * v * u * c.y1 + u * u * cy };
    };

    const frame = (nowMs: number) => {
      const now = nowMs / 1000;
      const dt = last ? Math.min(now - last, 0.05) : 0.016;
      last = now;
      const t = startAt < 0 ? 0 : reduced ? 99 : now - startAt;
      const act = activeRef.current;
      const actIdx = act ? assets.findIndex((a) => a.ticker === act) : -1;

      // orbit eases to a stop while something is hovered
      const target = reduced || actIdx >= 0 ? 0 : (Math.PI * 2) / ORBIT_PERIOD;
      orbitSpeed += (target - orbitSpeed) * Math.min(1, dt * 3);
      orbit += orbitSpeed * dt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // coin
      const cp = easeBack((t - T_COIN) / 0.7);
      coin.style.opacity = String(clamp01((t - T_COIN) / 0.4));
      coin.style.transform = `translate3d(-50%,-50%,0) scale(${0.6 + 0.4 * cp})`;

      // orbit guides
      const guideA = 0.1 * easeOut((t - 0.1) / 1.2);
      if (guideA > 0) {
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 7]);
        ctx.lineDashOffset = reduced ? 0 : -now * 6;
        ctx.strokeStyle = rgba(TEAL, guideA * 1.6);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([1, 5]);
        ctx.lineDashOffset = reduced ? 0 : now * 4;
        ctx.strokeStyle = rgba(TEAL, guideA);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 0.58, ry * 0.58, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(TEAL, guideA * 0.7);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 1.14, ry * 1.14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // arrival pulses on the coin rim
      for (let k = pulses.length - 1; k >= 0; k--) {
        const age = now - pulses[k].t0;
        if (age > 1.1) {
          pulses.splice(k, 1);
          continue;
        }
        const e = easeOut(age / 1.1);
        const hi = pulses[k].i === actIdx ? 1.6 : 1;
        ctx.strokeStyle = rgba(MINT, (1 - e) * 0.28 * hi);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, coinR + 4 + e * (compact ? 26 : 44), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < n; i++) {
        const p = pos(i, now);
        const c = curve(p);
        const t0 = T_PATH + i * PATH_STAGGER;
        const draw = easeOut((t - t0) / PATH_DUR);
        const g = (glow[i] += ((i === actIdx ? 1 : 0) - glow[i]) * Math.min(1, dt * 8));
        const dim = actIdx >= 0 && i !== actIdx ? 0.45 : 1;

        // path: drawn from the centre outward; stops at the token rim
        if (draw > 0) {
          const uEnd = 1 - draw;
          const uStart = Math.min(1, tokR / Math.hypot(cx - p.x, cy - p.y) + 0.01);
          const from = Math.max(uEnd, uStart);
          const s0 = at(c, from);
          const grad = ctx.createLinearGradient(p.x, p.y, cx, cy);
          grad.addColorStop(0, rgba(TEAL_D, (0.35 + 0.5 * g) * dim));
          grad.addColorStop(0.6, rgba(TEAL, (0.22 + 0.55 * g) * dim));
          grad.addColorStop(1, rgba(MINT, (0.3 + 0.5 * g) * dim));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1 + 1.25 * g;
          ctx.beginPath();
          ctx.moveTo(s0.x, s0.y);
          const STEPS = 28;
          for (let s = 1; s <= STEPS; s++) {
            const u = from + ((1 - from) * s) / STEPS;
            const q = at(c, u);
            ctx.lineTo(q.x, q.y);
          }
          ctx.stroke();
          // drawing head spark
          if (draw < 1) {
            const sp = sprites[3];
            const sz = compact ? 18 : 26;
            ctx.drawImage(sp, s0.x - sz / 2, s0.y - sz / 2, sz, sz);
          }
        }

        // token
        const el = tokenRefs.current[i];
        if (el) {
          const pop = (t - (t0 + PATH_DUR * 0.8)) / TOKEN_POP;
          const sc = (0.55 + 0.45 * easeBack(pop)) * (0.9 + 0.12 * p.depth) * (1 + 0.08 * g);
          el.style.opacity = String(clamp01(pop * 2) * (actIdx >= 0 && i !== actIdx ? 0.72 : 0.92 + 0.08 * p.depth));
          el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) scale(${sc})`;
        }

        // particles (after the path has landed)
        const live = clamp01((t - t0 - PATH_DUR) / 0.8);
        if (live <= 0 || reduced) continue;
        const speed = seeds[i].speed * (1 + 0.9 * g);
        const uStart = Math.min(1, tokR / Math.hypot(cx - p.x, cy - p.y));
        const uStop = 1 - coinR / Math.hypot(cx - p.x, cy - p.y);
        const span = uStop - uStart;
        const spriteSize = (compact ? 14 : 20) * (1 + 0.35 * g);
        const total = PARTICLES_IN + PARTICLES_OUT;
        for (let k = 0; k < total; k++) {
          const inbound = k < PARTICLES_IN;
          let f = (now * speed + seeds[i].phase + k / total) % 1;
          if (!inbound) f = 1 - ((now * speed * 0.7 + seeds[i].phase + 0.5) % 1);
          if (inbound) {
            const id = i * PARTICLES_IN + k;
            if (lastU[id] > 0.8 && f < 0.2 && pulses.length < 10) pulses.push({ t0: now, i });
            lastU[id] = f;
          }
          const fade = Math.sin(Math.PI * f); // fade in/out at both ends
          const alpha = live * fade * dim * (inbound ? 1 : 0.6);
          if (alpha < 0.02) continue;
          for (let tr = 0; tr < TRAIL; tr++) {
            const ff = inbound ? f - tr * 0.011 : f + tr * 0.011;
            if (ff < 0 || ff > 1) break;
            const q = at(c, uStart + span * ff);
            const tint = Math.round(clamp01(ff) * (sprites.length - 1));
            const s = spriteSize * (1 - tr / TRAIL) * (tr === 0 ? 1 : 0.7);
            ctx.globalAlpha = alpha * (1 - tr / TRAIL) * (tr === 0 ? 1 : 0.55);
            ctx.drawImage(sprites[tint], q.x - s / 2, q.y - s / 2, s, s);
          }
        }
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "source-over";

      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    let visible = false;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && startAt < 0) {
          startAt = performance.now() / 1000;
          stage.dataset.live = "1";
        }
        if (reduced) {
          requestAnimationFrame(frame); // one static frame
          return;
        }
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.25 },
    );
    io.observe(stage);
    const onVis = () => (document.hidden || !visible ? stop() : !reduced && start());
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => reduced && requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, [assets]);

  const activeAsset = assets.find((a) => a.ticker === active);

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label={`${assets.map((a) => a.ticker + pairSuffix).join(", ")}`}
      className="rwa-hub relative h-[400px] w-full select-none sm:h-[480px] lg:h-[560px]"
    >
      <style>{HUB_CSS}</style>

      {/* ambient field: centre glow + dot grid fading out radially */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_50%,rgba(1,175,177,0.16),transparent_70%)]" />
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(159,179,183,0.22)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_75%)]" />
      </div>

      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />

      {/* centre: $IDLE coin with breathing halo, ripple rings and a slow conic sweep */}
      <div
        ref={coinRef}
        className="absolute top-1/2 left-1/2 opacity-0"
        style={{ transform: "translate3d(-50%,-50%,0) scale(0.6)" }}
      >
        <div className="relative size-20 lg:size-[120px]">
          <span aria-hidden className="rwa-halo absolute -inset-[70%] rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.42),rgba(1,128,130,0.12)_45%,transparent_70%)]" />
          <span aria-hidden className="rwa-ripple absolute inset-0 rounded-full border border-teal-400/50" />
          <span aria-hidden className="rwa-ripple rwa-ripple-2 absolute inset-0 rounded-full border border-mint/40" />
          <span aria-hidden className="rwa-sweep absolute -inset-2.5 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(61,245,176,0.9)_40deg,transparent_90deg,transparent_180deg,rgba(0,198,201,0.8)_220deg,transparent_270deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#000_calc(100%-1px))]" />
          <span aria-hidden className="absolute -inset-2.5 rounded-full border border-teal-400/20" />
          <Image src={MARK} alt="" width={240} height={240} sizes="120px" className="relative size-full rounded-full" priority={false} />
        </div>
        <div className="absolute top-full left-1/2 mt-5 -translate-x-1/2 whitespace-nowrap text-center font-mono text-[12px] leading-4 tracking-[0.08em] uppercase lg:mt-7 lg:text-[13px]">
          <span
            key={activeAsset?.ticker ?? "idle"}
            className="rwa-swap inline-block rounded-full border border-teal-400/30 bg-bg/80 px-3 py-1.5 text-teal-400"
          >
            {activeAsset ? (
              <>
                <span className="text-ink">{activeAsset.ticker}</span>
                {pairSuffix}
              </>
            ) : (
              "$IDLE"
            )}
          </span>
        </div>
      </div>

      {/* orbiting tokens */}
      {assets.map((a, i) => {
        const on = active === a.ticker;
        return (
          <div
            key={a.ticker}
            ref={(el) => {
              tokenRefs.current[i] = el;
            }}
            onPointerEnter={() => onActive(a.ticker)}
            onPointerLeave={() => onActive(null)}
            onClick={() => onActive(on ? null : a.ticker)}
            className="absolute top-0 left-0 cursor-default opacity-0 will-change-transform"
          >
            <div className="relative flex flex-col items-center">
              <span
                aria-hidden
                className={cn(
                  "absolute top-0 left-1/2 size-12 -translate-x-1/2 rounded-full bg-teal-400/40 blur-xl transition-opacity duration-300 lg:size-[76px]",
                  on ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  "relative block size-12 overflow-hidden rounded-full ring-1 transition-[box-shadow] duration-300 lg:size-[76px]",
                  on ? "ring-2 ring-teal-300" : "ring-white/15",
                )}
              >
                <Image src={a.logo} alt="" width={160} height={160} sizes="(min-width: 1024px) 76px, 48px" className="size-full" />
                <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_45%)]" />
              </span>
              <span
                className={cn(
                  "relative mt-2 rounded-md bg-bg/85 px-1.5 py-0.5 font-mono text-[12px] leading-4 tracking-[0.04em] transition-colors duration-[250ms] max-sm:hidden",
                  on ? "text-teal-300" : "text-ink-2",
                )}
              >
                {on ? (
                  <>
                    {a.ticker}
                    <span className="text-ink-3">{pairSuffix}</span>
                  </>
                ) : (
                  a.ticker
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HUB_CSS = `
@keyframes rwa-breathe { 0%,100% { transform: scale(.9); opacity: .55 } 50% { transform: scale(1.08); opacity: 1 } }
@keyframes rwa-ripple { 0% { transform: scale(1); opacity: .7 } 100% { transform: scale(2.1); opacity: 0 } }
@keyframes rwa-spin { to { transform: rotate(360deg) } }
@keyframes rwa-swap { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
.rwa-hub .rwa-halo { animation: rwa-breathe 4.8s ease-in-out infinite; }
.rwa-hub .rwa-ripple { opacity: 0; }
.rwa-hub[data-live] .rwa-ripple { animation: rwa-ripple 3.6s cubic-bezier(.22,1,.36,1) infinite 1.2s; }
.rwa-hub[data-live] .rwa-ripple-2 { animation-delay: 3s; }
.rwa-hub .rwa-sweep { animation: rwa-spin 9s linear infinite; }
.rwa-hub .rwa-swap { animation: rwa-swap .25s ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .rwa-hub .rwa-halo, .rwa-hub .rwa-sweep, .rwa-hub .rwa-swap { animation: none; }
  .rwa-hub[data-live] .rwa-ripple { animation: none; opacity: 0; }
}
`;
