"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { rwa } from "@/data/content/landing";

type Item =
  | { kind: "label"; label: string; tone: "mint" | "violet" }
  | { kind: "token"; name: string; ticker: string; logo: string };

const pick = (t: string) => rwa.assets.find((a) => a.ticker === t);
const TOKENS = ["TSLA", "NVDA", "GLDX"].map(pick).filter((a): a is NonNullable<typeof a> => !!a);

// Order around the ring: alternate text chips and token coins so the ring never clumps.
const ITEMS: Item[] = [
  { kind: "label", label: "Humans", tone: "mint" },
  ...(TOKENS[0] ? [{ kind: "token" as const, ...TOKENS[0] }] : []),
  ...(TOKENS[2] ? [{ kind: "token" as const, ...TOKENS[2] }] : []),
  { kind: "label", label: "AI agents", tone: "violet" },
  ...(TOKENS[1] ? [{ kind: "token" as const, ...TOKENS[1] }] : []),
];

// Per-item angle offsets (radians, 0 = 3 o'clock, clockwise on screen) and slight radius variation.
const PHASE = [-2.45, -1.05, 0.25, 1.35, 2.55];
const RADIUS = [0.6, 0.63, 0.58, 0.61, 0.64];
const PERIOD = 90; // seconds per revolution — slow, ambient
const TILT = -0.18; // ellipse tilt (radians)

/**
 * Glass chips orbiting the particle mark (desktop only; the parent hides it below lg).
 * One rAF writes transforms on 5 nodes; pauses offscreen / hidden tab. Reduced motion → static ring.
 * Depth: items on the lower arc sit "in front" (larger, brighter), upper arc recedes.
 */
export function HeroOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = el.offsetWidth;
    let raf = 0;
    let running = false;
    let t = 0;
    let last = 0;

    const place = () => {
      const a0 = (t / PERIOD) * Math.PI * 2;
      const ct = Math.cos(TILT), st = Math.sin(TILT);
      nodes.current.forEach((n, i) => {
        if (!n) return;
        const a = a0 + PHASE[i % PHASE.length];
        const r = RADIUS[i % RADIUS.length] * size;
        const bob = still ? 0 : Math.sin(t * 0.6 + i * 1.7) * 5;
        let x = Math.cos(a) * r * 0.86;
        let y = Math.sin(a) * r * 0.88;
        const z = Math.sin(a); // +1 = front (bottom of the ring), -1 = back
        [x, y] = [x * ct - y * st, x * st + y * ct + bob];
        const d = (z + 1) / 2;
        const s = 0.84 + 0.2 * d;
        n.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        n.style.opacity = (0.5 + 0.5 * d).toFixed(3);
        n.style.zIndex = String(Math.round(d * 10));
      });
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      t += dt;
      place();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (still || running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    place();

    const ro = new ResizeObserver(() => {
      size = el.offsetWidth;
      place();
    });
    ro.observe(el);
    let inView = true;
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(el);
    const onVis = () => (document.hidden || !inView ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const GLOW = {
    mint: "shadow-[0_0_28px_-4px_rgba(61,245,176,0.55),inset_0_0_0_1px_rgba(61,245,176,0.28)]",
    violet: "shadow-[0_0_28px_-4px_rgba(155,123,255,0.6),inset_0_0_0_1px_rgba(155,123,255,0.32)]",
    teal: "shadow-[0_0_26px_-6px_rgba(0,198,201,0.6),inset_0_0_0_1px_rgba(0,198,201,0.26)]",
  };

  return (
    <div
      ref={root}
      aria-hidden
      className="hero-orbit pointer-events-none absolute inset-0 scale-[0.88] opacity-0 transition-[opacity,transform] delay-[900ms] duration-[1600ms] ease-[cubic-bezier(.16,1,.3,1)] group-data-[hero-live]/hero:scale-100 group-data-[hero-live]/hero:opacity-100 motion-reduce:delay-0"
    >
      {/* The orbit path: a soft brand-gradient glow (bright on the near arc, fading on the far arc). */}
      <svg
        className="absolute left-1/2 top-1/2 size-full overflow-visible"
        viewBox="-50 -50 100 100"
        style={{ transform: `translate(-50%, -50%) rotate(${(TILT * 180) / Math.PI}deg)` }}
      >
        <defs>
          <linearGradient id="hero-orbit-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9B7BFF" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#00C6C9" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3DF5B0" stopOpacity="0.9" />
          </linearGradient>
          <filter id="hero-orbit-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <ellipse rx={61 * 0.86} ry={61 * 0.88} fill="none" stroke="url(#hero-orbit-g)" strokeWidth="1.6" opacity="0.55" filter="url(#hero-orbit-blur)" />
        <ellipse rx={61 * 0.86} ry={61 * 0.88} fill="none" stroke="url(#hero-orbit-g)" strokeWidth="0.18" opacity="0.9" />
      </svg>
      {ITEMS.map((it, i) => (
        <div
          key={i}
          ref={(n) => {
            nodes.current[i] = n;
          }}
          className="absolute left-1/2 top-1/2 will-change-transform"
        >
          {it.kind === "label" ? (
            <span
              className={`flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0B1114]/70 py-1.5 pl-2.5 pr-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink backdrop-blur-md ${GLOW[it.tone]}`}
            >
              <span
                className={
                  it.tone === "mint"
                    ? "size-2 rounded-full bg-mint shadow-[0_0_10px_2px_rgba(61,245,176,0.7)]"
                    : "size-2 rounded-full bg-violet shadow-[0_0_10px_2px_rgba(155,123,255,0.75)]"
                }
              />
              {it.label}
            </span>
          ) : (
            <span
              className={`flex items-center gap-2 whitespace-nowrap rounded-full bg-[#0B1114]/70 p-1 pr-3 backdrop-blur-md ${GLOW.teal}`}
            >
              {/* xStocks PNGs are square: a round frame + slight overscale hides every corner. */}
              <span className="relative block size-8 shrink-0 overflow-hidden rounded-full [clip-path:circle(50%)]">
                <Image src={it.logo} alt="" fill sizes="36px" className="scale-[1.14] object-cover" />
              </span>
              <span className="font-mono text-[12px] font-medium tracking-[0.04em] text-ink">{it.ticker}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
