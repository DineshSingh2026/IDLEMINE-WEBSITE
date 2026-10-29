"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT = 6; // degrees
const PARALLAX = 10; // px the artwork drifts against the tilt
const STIFFNESS = 140;
const DAMPING = 17;

const RING = {
  mint: "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, rgba(1,128,130,0.0) 210deg, #00C6C9 290deg, #3DF5B0 335deg, transparent 360deg)",
  violet:
    "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, rgba(0,198,201,0.0) 210deg, #00C6C9 285deg, #9B7BFF 335deg, transparent 360deg)",
} as const;

const SPOT = {
  mint: "radial-gradient(closest-side, rgba(61,245,176,0.16), rgba(0,198,201,0.07) 45%, transparent 100%)",
  violet: "radial-gradient(closest-side, rgba(155,123,255,0.20), rgba(0,198,201,0.05) 50%, transparent 100%)",
} as const;

/**
 * Card shell with pointer-driven 3D tilt (spring-smoothed, fine pointers only, off for reduced motion),
 * a cursor-following spotlight, a rotating gradient hairline that brightens on hover/focus and an
 * artwork parallax hook: any descendant marked `data-eco-parallax` drifts opposite to the tilt.
 * Background layers sit at -z-10 inside the card's own stacking context (`isolate`), so the CTA's
 * stretched ::after still covers the whole card.
 */
export function TiltCard({
  tone,
  spin = "a",
  className,
  children,
}: {
  tone: "mint" | "violet";
  spin?: "a" | "b" | "c";
  className?: string;
  children: React.ReactNode;
}) {
  const card = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = card.current;
    const light = spot.current;
    if (!el || !light) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const art = el.querySelector<HTMLElement>("[data-eco-parallax]");

    // spring state: x = rotateY driver, y = rotateX driver (both -0.5..0.5)
    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
    let rect: DOMRect | null = null;
    let raf = 0;
    let last = 0;
    let hovering = false;

    const render = () => {
      el.style.transform = `perspective(1100px) rotateX(${(-s.y * 2 * MAX_TILT).toFixed(3)}deg) rotateY(${(s.x * 2 * MAX_TILT).toFixed(3)}deg)`;
      if (art) art.style.transform = `translate3d(${(-s.x * 2 * PARALLAX).toFixed(2)}px, ${(-s.y * 2 * PARALLAX).toFixed(2)}px, 0)`;
      light.style.transform = `translate3d(${s.mx.toFixed(1)}px, ${s.my.toFixed(1)}px, 0) translate(-50%, -50%)`;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000 || 1 / 60, 1 / 30);
      last = t;
      const ax = STIFFNESS * (s.tx - s.x) - DAMPING * s.vx;
      const ay = STIFFNESS * (s.ty - s.y) - DAMPING * s.vy;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = 1 - Math.pow(0.0008, dt); // frame-rate independent ease for the spotlight
      s.mx += (s.tmx - s.mx) * k;
      s.my += (s.tmy - s.my) * k;
      render();
      const settled =
        Math.abs(s.tx - s.x) < 0.0005 && Math.abs(s.ty - s.y) < 0.0005 && Math.abs(s.vx) + Math.abs(s.vy) < 0.001;
      if (!hovering && settled) {
        s.x = s.y = s.vx = s.vy = 0;
        el.style.transform = "";
        if (art) art.style.transform = "";
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const aim = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      s.tx = Math.max(-0.5, Math.min(0.5, px / rect.width - 0.5));
      s.ty = Math.max(-0.5, Math.min(0.5, py / rect.height - 0.5));
      s.tmx = px;
      s.tmy = py;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches || reduce.matches) return;
      hovering = true;
      rect = el.getBoundingClientRect();
      aim(e);
      s.mx = s.tmx; // spotlight appears under the cursor, no fly-in
      s.my = s.tmy;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (!hovering) return;
      aim(e);
      kick();
    };
    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      rect = null;
      s.tx = 0;
      s.ty = 0;
      kick();
    };
    const onScroll = () => {
      rect = null;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <article
      ref={card}
      className={cn("group relative isolate flex h-full flex-col rounded-[20px] p-6", className)}
    >
      {/* hairline: static base + rotating comet that brightens on hover / keyboard focus */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[20px] bg-line">
        <div
          className={cn(
            "eco-anim eco-spin absolute left-1/2 top-1/2 aspect-square w-[240%] opacity-30 transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
            spin === "b" && "eco-spin-b",
            spin === "c" && "eco-spin-c",
          )}
          style={{ background: RING[tone] }}
        />
      </div>
      {/* surface + spotlight, inset by the 1px hairline */}
      <div aria-hidden className="pointer-events-none absolute inset-px -z-10 overflow-hidden rounded-[19px] bg-surface">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }}
        />
        <div
          ref={spot}
          className="absolute left-0 top-0 size-[440px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
          style={{ background: SPOT[tone] }}
        />
      </div>
      {children}
    </article>
  );
}
