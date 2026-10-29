"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Borderless full bleed finale: low intensity aurora (teal, mint, violet), concentric orbit rings
 * with a mint (humans) and a violet (agents) satellite, and floating dust, all painted directly on
 * the canvas. The light layer is masked so it melts into the page above, below and at the sides:
 * no panel, no rim, no edge. Transform/opacity keyframes only, paused off screen, still under
 * prefers-reduced-motion.
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
.cta-fade{
  -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 22%,#000 74%,transparent 100%),linear-gradient(90deg,transparent 0%,#000 14%,#000 86%,transparent 100%);
  -webkit-mask-composite:source-in;
  mask-image:linear-gradient(180deg,transparent 0%,#000 22%,#000 74%,transparent 100%),linear-gradient(90deg,transparent 0%,#000 14%,#000 86%,transparent 100%);
  mask-composite:intersect;
}
@media (prefers-reduced-motion:reduce){
  .cta-spin,.cta-spin-r,.cta-a1,.cta-a2,.cta-a3,.cta-pulse{animation:none!important}
  .cta-p{animation:none!important;opacity:var(--o)}
  .cta-par{transform:none!important}
}
`;

/* Deterministic dust (identical on server and client, no hydration drift). */
const DUST = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const colors = ["#00C6C9", "#00C6C9", "#00C6C9", "#4DD9DB", "#3DF5B0", "#9B7BFF"];
  return Array.from({ length: 34 }, () => ({
    left: 8 + rnd() * 84,
    top: 16 + rnd() * 70,
    size: 1 + rnd() * 2,
    color: colors[Math.floor(rnd() * colors.length)],
    o: 0.4 + rnd() * 0.5,
    t: 9 + rnd() * 9,
    dl: -rnd() * 18,
    dx: (rnd() - 0.5) * 40,
  }));
})();

const RINGS = [
  { r: 12, cls: "border-teal-400/[0.30]" },
  { r: 20, cls: "border-teal-400/[0.24]" },
  { r: 30, cls: "border-mint/[0.18] border-dashed" },
  { r: 42, cls: "border-violet/[0.18]" },
  { r: 56, cls: "border-teal-400/[0.10]" },
];

export function CtaStage({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const par = useRef<HTMLDivElement>(null);

  // Pause every keyframe while the finale is off screen.
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

  // Gentle pointer parallax on the ring system (mouse only, eased by a transition).
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
    <div ref={root} onPointerMove={onMove} onPointerLeave={onLeave} className="cta-root relative isolate">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Light layer: bleeds past the section (top and bottom) and is masked to nothing at every edge. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="cta-fade pointer-events-none absolute inset-x-0 -top-28 -bottom-24 -z-10 overflow-hidden md:-top-36 md:-bottom-28 lg:-top-44 lg:-bottom-32"
      >
        {/* Aurora mesh: radial gradients (no blur filters), drifting slowly */}
        <div
          className="cta-a1 absolute left-[2%] top-[4%] h-[80%] w-[56%]"
          style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.42), rgba(0,198,201,0.12) 50%, transparent)" }}
        />
        <div
          className="cta-a2 absolute right-[2%] top-[10%] h-[76%] w-[50%]"
          style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.34), rgba(155,123,255,0.10) 52%, transparent)" }}
        />
        <div
          className="cta-a3 absolute bottom-[2%] left-[24%] h-[64%] w-[54%]"
          style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.26), rgba(61,245,176,0.07) 52%, transparent)" }}
        />
        {/* Deep teal core behind the headline */}
        <div
          className="cta-pulse absolute left-1/2 top-1/2 h-[64%] w-[60%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(closest-side, rgba(1,128,130,0.40), rgba(1,59,61,0.18) 55%, transparent)" }}
        />

        {/* Dot grid, faded radially */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(179,240,241,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_75%)]" />

        {/* Ring system centred on the emblem/headline, with pointer parallax */}
        <div ref={par} className="cta-par absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="absolute left-1/2 top-[44%] size-0 scale-[0.42] sm:scale-75 lg:scale-100">
            {RINGS.map((ring, k) => (
              <div
                key={k}
                className={`absolute rounded-full border ${ring.cls}`}
                style={{ width: `${ring.r * 2}rem`, height: `${ring.r * 2}rem`, left: `-${ring.r}rem`, top: `-${ring.r}rem` }}
              />
            ))}
            {/* slowly rotating dashed orbit */}
            <svg viewBox="0 0 200 200" className="cta-spin absolute -left-[25rem] -top-[25rem] size-[50rem]" style={{ "--d": "120s" } as React.CSSProperties}>
              <circle cx="100" cy="100" r="99.5" fill="none" stroke="rgba(0,198,201,0.18)" strokeWidth="0.25" strokeDasharray="0.6 2.4" />
            </svg>
            {/* mint satellite (humans) */}
            <div className="cta-spin absolute -left-[30rem] -top-[30rem] size-[60rem]" style={{ "--d": "46s" } as React.CSSProperties}>
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_14px_rgba(61,245,176,0.8)]" />
            </div>
            {/* violet satellite (agents) */}
            <div className="cta-spin-r absolute -left-[20rem] -top-[20rem] size-[40rem]" style={{ "--d": "34s" } as React.CSSProperties}>
              <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet shadow-[0_0_14px_rgba(155,123,255,0.8)]" />
            </div>
            {/* teal satellite on the outer ring */}
            <div className="cta-spin absolute -left-[42rem] -top-[42rem] size-[84rem]" style={{ "--d": "80s" } as React.CSSProperties}>
              <span className="absolute left-0 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(0,198,201,0.8)]" />
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
      </motion.div>

      <div className="relative">{children}</div>
    </div>
  );
}

/** The official mark (unaltered) in a round coin rim with a breathing halo. */
export function CtaEmblem() {
  return (
    <div aria-hidden className="relative mx-auto size-[76px] md:size-[92px]">
      <div className="cta-pulse absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.42)_0%,rgba(0,198,201,0.10)_45%,transparent_70%)]" />
      <div className="absolute inset-0 rounded-full border border-teal-400/50 bg-[radial-gradient(circle,#05080A_0%,#05080A_55%,#013B3D_100%)] shadow-[0_0_30px_rgba(0,198,201,0.35)]" />
      <div className="absolute inset-[22%]">
        <Image src="/assets/img/idlemine-mark.png" alt="" fill sizes="56px" className="object-contain" />
      </div>
    </div>
  );
}
