"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Agent Games: holographic arena showcase built from the two real MidEarth arena renders.
 * Territory Control is the hero, Food Collector floats behind at a shallower depth. Each render sits
 * in 3D perspective with soft masked edges (no frame), a slow Ken Burns pan, a sweeping scan line,
 * a violet/teal chromatic edge glow and a glossy reflection on the floor below.
 * Layer nesting (one transform owner each): data-depth (scroll, EcoStage) > data-tilt (pointer, FloatRow)
 * > eco-fade (entrance) > focus (hover) > pose (3D) > loops. Transform/opacity only; loops carry
 * `eco-anim` so they pause off screen and stop under reduced motion (a static composed frame).
 * Hover focus is hit tested from the row (the CTA's stretched ::after sits above the art).
 */

const V = "155,123,255";
const T = "0,198,201";
const M = "61,245,176";

const CSS = `
@keyframes ag-kb { 0% { transform: scale(1.06) translate3d(-2.5%,1.5%,0); } 100% { transform: scale(1.18) translate3d(2.5%,-2.5%,0); } }
@keyframes ag-scan { 0% { transform: translate3d(0,-120%,0); opacity: 0; } 8% { opacity: 1; } 70% { opacity: 1; } 78%, 100% { transform: translate3d(0,520%,0); opacity: 0; } }
@keyframes ag-ray { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes ag-rise { 0% { transform: translate3d(0,0,0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: .9; } 100% { transform: translate3d(var(--ag-x,0px),-120px,0); opacity: 0; } }
@keyframes ag-cube { 0%, 100% { transform: translate3d(0,0,0) rotate(var(--ag-r,20deg)); } 50% { transform: translate3d(0,-14px,0) rotate(calc(var(--ag-r,20deg) + 50deg)); } }
@keyframes ag-pulse { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(2.8); opacity: 0; } }
@keyframes ag-bob { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-8px,0); } }
.ag-kb { animation: ag-kb 22s ease-in-out infinite alternate; }
.ag-scan { animation: ag-scan 6.5s cubic-bezier(.45,0,.55,1) infinite; }
.ag-ray { animation: ag-ray 7s ease-in-out infinite; }
.ag-rise { animation: ag-rise var(--ag-d,7s) linear var(--ag-dl,0s) infinite; }
.ag-cube { animation: ag-cube var(--ag-d,8s) ease-in-out var(--ag-dl,0s) infinite; }
.ag-pulse { animation: ag-pulse 1.9s cubic-bezier(0,0,.2,1) infinite; }
.ag-bob { animation: ag-bob 6s ease-in-out infinite; }
.ag-focus { transition: transform .7s cubic-bezier(.16,1,.3,1), opacity .6s ease; }
.ag-lit { opacity: 0; transition: opacity .6s ease; }
.ag[data-focus="tc"] .ag-f-tc, .ag[data-focus="fc"] .ag-f-fc { transform: scale(1.06); }
.ag[data-focus="tc"] .ag-f-tc .ag-lit, .ag[data-focus="fc"] .ag-f-fc .ag-lit { opacity: 1; }
.ag[data-focus="tc"] .ag-f-fc, .ag[data-focus="fc"] .ag-f-tc { transform: scale(.93); opacity: .6; }
.ag[data-focus="fc"] .ag-z-fc { z-index: 3; }
@media (prefers-reduced-motion: reduce) { .ag-rise { opacity: .7; } .ag-scan { display: none; } }
`;

function Layer({
  depth = 0,
  tilt = 0,
  delay = 0,
  className,
  children,
}: {
  depth?: number;
  tilt?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-depth={depth} className={cn("pointer-events-none absolute inset-0 will-change-transform", className)}>
      <div data-tilt={tilt} className="absolute inset-0">
        <div className="eco-fade absolute inset-0" style={{ "--eco-d": `calc(var(--eco-base, 0) + ${delay})` } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Soft elliptical mask: the render dissolves into the canvas, no edge anywhere. */
const MASK = "radial-gradient(ellipse 50% 50% at 50% 48%, #000 58%, rgba(0,0,0,.55) 78%, transparent 100%)";
const REFLECT_MASK = "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(0,0,0,.75), rgba(0,0,0,.25) 45%, transparent 80%)";

function Render({
  id,
  src,
  label,
  pose,
  tint,
  kbDelay,
  scanDelay,
  hit,
}: {
  id: "tc" | "fc";
  src: string;
  label: string;
  pose: string;
  tint: string;
  kbDelay: string;
  scanDelay: string;
  hit: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={hit} className={cn("ag-focus absolute inset-0", `ag-f-${id}`)} style={{ transformOrigin: "50% 70%" }}>
      <div className="absolute inset-0" style={{ transform: pose, transformOrigin: "50% 60%" }}>
        {/* chromatic edge glow: violet left, teal right, edgeless */}
        <div
          aria-hidden
          className="absolute -inset-[6%] blur-[26px]"
          style={{
            background: `radial-gradient(38% 46% at 22% 48%, rgba(${V},0.55), transparent 100%), radial-gradient(38% 46% at 80% 52%, rgba(${tint},0.5), transparent 100%)`,
          }}
        />
        {/* the render, masked into the canvas */}
        <div className="absolute inset-0 overflow-hidden" style={{ WebkitMaskImage: MASK, maskImage: MASK }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${label} arena`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="eco-anim ag-kb absolute inset-0 size-full object-cover"
            style={{ objectPosition: "50% 52%", animationDelay: kbDelay }}
          />
          {/* holographic scan line */}
          <div
            aria-hidden
            className="eco-anim ag-scan absolute inset-x-0 top-0 h-[22%] mix-blend-screen"
            style={{
              background: `linear-gradient(180deg, transparent, rgba(${V},0.10) 45%, rgba(${T},0.55) 50%, rgba(${V},0.10) 55%, transparent)`,
              animationDelay: scanDelay,
            }}
          />
          {/* hover brighten (opacity only) */}
          <div
            aria-hidden
            className="ag-lit absolute inset-0 mix-blend-screen"
            style={{ background: `radial-gradient(60% 55% at 50% 45%, rgba(${V},0.30), rgba(${T},0.10) 60%, transparent)` }}
          />
        </div>
        {/* glossy reflection on the floor */}
        <div
          aria-hidden
          className="absolute inset-x-[6%] top-[97%] h-[26%] overflow-hidden opacity-45"
          style={{ WebkitMaskImage: REFLECT_MASK, maskImage: REFLECT_MASK }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 bottom-0 h-[300%] w-full object-cover blur-[2px]"
            style={{ transform: "scaleY(-1)", objectPosition: "50% 100%" }}
          />
        </div>
        {/* floating label */}
        <div className="eco-anim ag-bob absolute left-1/2 top-[84%] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#EDE7FF] sm:text-[12px]">
          <span className="relative flex size-2">
            <span className="eco-anim ag-pulse absolute inset-0 rounded-full" style={{ background: `rgb(${V})` }} />
            <span className="relative size-2 rounded-full" style={{ background: "#B9A4FF", boxShadow: `0 0 10px rgba(${V},0.95)` }} />
          </span>
          <span style={{ textShadow: `0 0 14px rgba(${V},0.9), 0 1px 3px rgba(4,6,12,0.9)` }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

/** Drifting motes: [left %, bottom %, size px, duration s, delay s, drift px, violet?]. */
const MOTES: readonly [number, number, number, number, number, number, boolean][] = [
  [8, 20, 4, 7, 0, 10, true],
  [18, 46, 3, 6, 2.2, -8, false],
  [30, 12, 5, 8, 1.1, 6, true],
  [44, 30, 3, 6.5, 3.4, -6, false],
  [56, 16, 4, 7.5, 0.6, 8, true],
  [66, 40, 3, 6, 4.1, -4, false],
  [78, 22, 5, 8.5, 1.8, -10, true],
  [90, 36, 3, 6.2, 2.9, 6, false],
  [24, 60, 3, 7, 5, 4, false],
  [72, 62, 4, 7.8, 3.8, -6, true],
  [50, 54, 3, 6.8, 5.6, 5, true],
  [96, 14, 4, 7.2, 0.3, -8, false],
];

/** Small glowing cubes: [left %, top %, size px, duration s, delay s, rotation deg, colour]. */
const CUBES: readonly [number, number, number, number, number, number, string][] = [
  [3, 18, 12, 7, 0, 18, V],
  [93, 6, 10, 8.3, 0.9, 41, T],
  [62, 4, 8, 9.6, 1.8, 64, M],
  [98, 58, 11, 10.9, 2.7, 87, V],
  [1, 66, 9, 12.2, 3.6, 110, T],
  [46, 86, 8, 13.5, 4.5, 133, V],
];

export function AgentShowcase({ images, logo }: { images: readonly string[]; logo?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLDivElement>(null);
  const fc = useRef<HTMLDivElement>(null);
  const [heroSrc = "", backSrc = heroSrc] = images;

  useEffect(() => {
    const el = root.current;
    const row = el?.closest("article");
    if (!el || !row) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const inside = (n: HTMLElement | null, x: number, y: number) => {
      if (!n) return false;
      const r = n.getBoundingClientRect();
      // the soft mask shows roughly the inner 80% of the box
      const ix = r.width * 0.1;
      const iy = r.height * 0.08;
      return x > r.left + ix && x < r.right - ix && y > r.top + iy && y < r.bottom - iy;
    };
    const set = (f: string) => {
      if (el.dataset.focus !== f) el.dataset.focus = f;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      set(inside(tc.current, e.clientX, e.clientY) ? "tc" : inside(fc.current, e.clientX, e.clientY) ? "fc" : "");
    };
    const onLeave = () => set("");
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", onLeave);
    return () => {
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={root} className="ag absolute inset-0" data-focus="">
      <style>{CSS}</style>

      {/* back: volumetric rays from above + violet pool and floor horizon */}
      <Layer depth={-14} tilt={3}>
        <div aria-hidden className="absolute inset-x-[4%] -top-[16%] h-[92%]">
          {[
            [18, -14, V, 0],
            [40, -4, T, 2.3],
            [60, 6, V, 4.6],
            [80, 16, T, 1.2],
          ].map(([l, r, c, d], i) => (
            <div
              key={i}
              className="eco-anim ag-ray absolute top-0 h-full w-[18%] blur-[18px]"
              style={{
                left: `${l}%`,
                transform: `translateX(-50%) rotate(${r}deg)`,
                transformOrigin: "50% 0",
                background: `linear-gradient(180deg, rgba(${c},0.34), rgba(${c},0.10) 55%, transparent)`,
                animationDelay: `${d}s`,
              }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute inset-x-[2%] top-[64%] h-[46%]"
          style={{ background: `radial-gradient(50% 50% at 46% 40%, rgba(${V},0.42), rgba(${V},0.12) 50%, transparent 100%)` }}
        />
        <div
          aria-hidden
          className="absolute inset-x-[4%] top-[86%] h-px"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${T},0.6) 30%, rgba(${V},0.7) 65%, transparent)` }}
        />
      </Layer>

      {/* mid: Food Collector, further away */}
      <Layer depth={4} tilt={7} delay={120} className="ag-z-fc">
        <div className="absolute right-0 top-[7%] h-[60%] w-[39%] opacity-90" style={{ perspective: "900px" }}>
          <Render
            id="fc"
            hit={fc}
            src={backSrc}
            label="Food Collector"
            pose="rotateY(-20deg) rotateX(6deg)"
            tint={M}
            kbDelay="-9s"
            scanDelay="-3.2s"
          />
        </div>
      </Layer>

      {/* hero: Territory Control */}
      <Layer depth={16} tilt={15} delay={0} className="z-[2]">
        <div className="absolute left-0 -top-[4%] h-[92%] w-[68%]" style={{ perspective: "1000px" }}>
          <Render
            id="tc"
            hit={tc}
            src={heroSrc}
            label="Territory Control"
            pose="rotateY(16deg) rotateX(7deg)"
            tint={T}
            kbDelay="0s"
            scanDelay="0s"
          />
        </div>
      </Layer>

      {/* fore: motes, glowing cubes, MidEarth mark */}
      <Layer depth={30} tilt={26} delay={260} className="z-[4]">
        {MOTES.map(([l, b, s, d, dl, x, violet], i) => (
          <span
            key={i}
            aria-hidden
            className="eco-anim ag-rise absolute rounded-full"
            style={
              {
                left: `${l}%`,
                bottom: `${b}%`,
                width: s,
                height: s,
                background: violet ? "#C9B8FF" : "#7FF3F4",
                boxShadow: `0 0 10px rgba(${violet ? V : T},0.95)`,
                "--ag-d": `${d}s`,
                "--ag-dl": `${-dl}s`,
                "--ag-x": `${x}px`,
              } as React.CSSProperties
            }
          />
        ))}
        {CUBES.map(([l, t, s, d, dl, r, c], i) => (
          <span
            key={i}
            aria-hidden
            className="eco-anim ag-cube absolute rounded-[3px]"
            style={
              {
                left: `${l}%`,
                top: `${t}%`,
                width: s,
                height: s,
                background: `linear-gradient(135deg, rgba(255,255,255,0.85), rgba(${c},1) 40%, rgba(${c},0.55))`,
                boxShadow: `0 0 14px rgba(${c},0.85), 0 0 2px rgba(255,255,255,0.6) inset`,
                "--ag-d": `${d}s`,
                "--ag-dl": `${-dl}s`,
                "--ag-r": `${r}deg`,
              } as React.CSSProperties
            }
          />
        ))}
        {logo && (
          <div className="eco-anim ag-bob absolute -top-[4%] right-[3%] flex items-center gap-2" style={{ animationDelay: "-2s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="MidEarth"
              width={28}
              height={28}
              className="size-6 sm:size-7"
              style={{ filter: `drop-shadow(0 0 10px rgba(${M},0.7))` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#BFF8E6] sm:text-[11px]">MidEarth arenas</span>
          </div>
        )}
      </Layer>
    </div>
  );
}
