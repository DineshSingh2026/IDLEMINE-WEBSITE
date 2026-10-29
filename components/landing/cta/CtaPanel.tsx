"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Cinematic finale panel: travelling gradient hairline, low-intensity aurora (teal → mint → violet)
 * over bg-void, concentric orbit rings with a mint (humans) and a violet (agents) satellite, and
 * floating dust. Everything animates with transform/opacity only (CSS keyframes on the compositor),
 * pauses while off-screen, and is a still frame under prefers-reduced-motion.
 */
const CSS = `
@keyframes cta-spin{to{transform:rotate(360deg)}}
@keyframes cta-spin-r{to{transform:rotate(-360deg)}}
@keyframes cta-a1{0%,100%{transform:translate3d(-8%,-6%,0) scale(1)}50%{transform:translate3d(10%,8%,0) scale(1.18)}}
@keyframes cta-a2{0%,100%{transform:translate3d(6%,4%,0) scale(1.1)}50%{transform:translate3d(-12%,-6%,0) scale(.9)}}
@keyframes cta-a3{0%,100%{transform:translate3d(0,8%,0) scale(.95)}50%{transform:translate3d(8%,-10%,0) scale(1.15)}}
@keyframes cta-float{0%{transform:translate3d(0,0,0);opacity:0}15%{opacity:var(--o)}85%{opacity:var(--o)}100%{transform:translate3d(var(--dx),-90px,0);opacity:0}}
@keyframes cta-pulse{0%,100%{opacity:.45;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}
.cta-spin{animation:cta-spin var(--d,40s) linear infinite;will-change:transform}
.cta-spin-r{animation:cta-spin-r var(--d,40s) linear infinite;will-change:transform}
.cta-a1{animation:cta-a1 22s ease-in-out infinite;will-change:transform}
.cta-a2{animation:cta-a2 28s ease-in-out infinite;will-change:transform}
.cta-a3{animation:cta-a3 34s ease-in-out infinite;will-change:transform}
.cta-p{animation:cta-float var(--t) linear infinite;animation-delay:var(--dl);opacity:0}
.cta-pulse{animation:cta-pulse 6s ease-in-out infinite}
.cta-root[data-paused] *{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){
  .cta-spin,.cta-spin-r,.cta-a1,.cta-a2,.cta-a3,.cta-pulse{animation:none!important}
  .cta-p{animation:none!important;opacity:var(--o)}
  .cta-par{transform:none!important}
}
`;

/* Deterministic dust (identical on server and client — no hydration drift). */
const DUST = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const colors = ["#00C6C9", "#00C6C9", "#00C6C9", "#4DD9DB", "#3DF5B0", "#9B7BFF"];
  return Array.from({ length: 26 }, () => ({
    left: 4 + rnd() * 92,
    top: 18 + rnd() * 78,
    size: 1 + rnd() * 1.8,
    color: colors[Math.floor(rnd() * colors.length)],
    o: 0.35 + rnd() * 0.5,
    t: 9 + rnd() * 9,
    dl: -rnd() * 18,
    dx: (rnd() - 0.5) * 40,
  }));
})();

const RINGS = [
  { r: 12, cls: "border-teal-400/[0.16]" },
  { r: 22, cls: "border-teal-400/[0.18]" },
  { r: 34, cls: "border-teal-400/[0.12] border-dashed" },
  { r: 48, cls: "border-teal-400/[0.09]" },
  { r: 64, cls: "border-teal-400/[0.06]" },
];

export function CtaPanel({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const par = useRef<HTMLDivElement>(null);

  // Pause every keyframe while the panel is off-screen.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.setAttribute("data-paused", "");
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) el.removeAttribute("data-paused");
      else el.setAttribute("data-paused", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle pointer parallax on the ring system (mouse only, CSS-var driven, eased by a transition).
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !par.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    par.current.style.transform = `translate3d(${(x * 22).toFixed(1)}px, ${(y * 16).toFixed(1)}px, 0)`;
  };
  const onLeave = () => {
    if (par.current) par.current.style.transform = "translate3d(0,0,0)";
  };

  return (
    <motion.div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="cta-root relative isolate overflow-hidden rounded-[20px] bg-line"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Travelling hairline: a rotating conic sweep, revealed only in the 1px gap around the inner panel. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="cta-spin absolute left-1/2 top-1/2 aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 sm:w-[170%] lg:w-[130%]"
          style={
            {
              "--d": "9s",
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(1,128,130,0.0) 262deg, #00C6C9 300deg, #3DF5B0 322deg, #9B7BFF 342deg, transparent 360deg)",
            } as React.CSSProperties
          }
        />
      </div>

      {/* Inner panel (bg-void) */}
      <div className="relative m-px overflow-hidden rounded-[19px] bg-bg">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Aurora mesh — radial gradients (no blur filters), drifting slowly */}
          <div
            className="cta-a1 absolute -left-[20%] -top-[40%] h-[110%] w-[80%]"
            style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.22), rgba(0,198,201,0.06) 55%, transparent)" }}
          />
          <div
            className="cta-a2 absolute -right-[18%] -top-[20%] h-[100%] w-[70%]"
            style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.16), rgba(155,123,255,0.04) 55%, transparent)" }}
          />
          <div
            className="cta-a3 absolute -bottom-[45%] left-[18%] h-[100%] w-[70%]"
            style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.12), rgba(61,245,176,0.03) 55%, transparent)" }}
          />

          {/* Dot grid, faded to the edges */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,#000_20%,transparent_75%)]" />

          {/* Ring system (centred on the emblem/headline), with pointer parallax */}
          <div
            ref={par}
            className="cta-par absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <div className="absolute left-1/2 top-[40%] size-0 scale-[0.45] sm:scale-75 lg:scale-100">
              {RINGS.map((ring, k) => (
                <div
                  key={k}
                  className={`absolute rounded-full border ${ring.cls}`}
                  style={{ width: `${ring.r * 2}rem`, height: `${ring.r * 2}rem`, left: `-${ring.r}rem`, top: `-${ring.r}rem` }}
                />
              ))}
              {/* slowly rotating dashed orbit */}
              <svg
                viewBox="0 0 200 200"
                className="cta-spin absolute -left-[28rem] -top-[28rem] size-[56rem]"
                style={{ "--d": "120s" } as React.CSSProperties}
              >
                <circle cx="100" cy="100" r="99.5" fill="none" stroke="rgba(0,198,201,0.16)" strokeWidth="0.25" strokeDasharray="0.6 2.4" />
              </svg>
              {/* mint satellite (humans) */}
              <div
                className="cta-spin absolute -left-[34rem] -top-[34rem] size-[68rem]"
                style={{ "--d": "46s" } as React.CSSProperties}
              >
                <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_12px_rgba(61,245,176,0.7)]" />
              </div>
              {/* violet satellite (agents) */}
              <div
                className="cta-spin-r absolute -left-[22rem] -top-[22rem] size-[44rem]"
                style={{ "--d": "34s" } as React.CSSProperties}
              >
                <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet shadow-[0_0_12px_rgba(155,123,255,0.7)]" />
              </div>
              {/* teal satellite on the inner ring */}
              <div
                className="cta-spin absolute -left-[48rem] -top-[48rem] size-[96rem]"
                style={{ "--d": "80s" } as React.CSSProperties}
              >
                <span className="absolute left-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400" />
              </div>
            </div>
          </div>

          {/* Floating dust */}
          {DUST.map((p, k) => (
            <span
              key={k}
              className="cta-p absolute rounded-full"
              style={
                {
                  left: `${p.left.toFixed(2)}%`,
                  top: `${p.top.toFixed(2)}%`,
                  width: `${p.size.toFixed(2)}px`,
                  height: `${p.size.toFixed(2)}px`,
                  background: p.color,
                  "--o": p.o.toFixed(2),
                  "--t": `${p.t.toFixed(2)}s`,
                  "--dl": `${p.dl.toFixed(2)}s`,
                  "--dx": `${p.dx.toFixed(1)}px`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Vignette keeps edges calm and copy legible */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_45%,transparent_40%,rgba(5,8,10,0.75)_100%)]" />
          {/* top hairline sheen */}
          <div className="absolute inset-x-[10%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.5),rgba(155,123,255,0.4),transparent)]" />
        </div>

        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}

/** The official mark (unaltered) in a hairline coin rim with a breathing halo. */
export function CtaEmblem() {
  return (
    <div aria-hidden className="relative mx-auto size-[76px] md:size-[92px]">
      <div className="cta-pulse absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.22)_0%,rgba(0,198,201,0.06)_45%,transparent_70%)]" />
      <div className="absolute inset-0 rounded-full border border-teal-400/30 bg-surface" />
      <div className="absolute inset-[22%]">
        <Image src="/assets/img/idlemine-mark.png" alt="" fill sizes="56px" className="object-contain" />
      </div>
    </div>
  );
}
