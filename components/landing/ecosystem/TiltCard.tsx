"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { WORLDS, type WorldKey } from "./worlds";

const STIFFNESS = 140;
const DAMPING = 17;

/**
 * Card shell: a tinted gradient world with a gradient hairline border, inner glow edges, a rotating
 * comet on the border, a cursor-following spotlight and a hover wash that intensifies the colour world.
 * Pointer-driven 3D tilt is spring-smoothed, fine pointers only, off for reduced motion. Any descendant
 * marked `data-tilt="<px>"` drifts against the tilt by that many px, so art layers separate in depth.
 * Background layers sit at -z-10 inside the card's own stacking context (`isolate`), so the CTA's
 * stretched ::after still covers the whole card.
 */
export function TiltCard({
  world,
  spin = "a",
  className,
  children,
}: {
  world: WorldKey;
  spin?: "a" | "b" | "c";
  className?: string;
  children: React.ReactNode;
}) {
  const card = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const w = WORLDS[world];

  useEffect(() => {
    const el = card.current;
    const light = spot.current;
    if (!el || !light) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-tilt]")).map((n) => ({
      n,
      d: Number(n.dataset.tilt) || 0,
    }));

    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
    let rect: DOMRect | null = null;
    let raf = 0;
    let last = 0;
    let hovering = false;
    let maxTilt = 5;

    const render = () => {
      el.style.transform = `perspective(1200px) rotateX(${(-s.y * 2 * maxTilt).toFixed(3)}deg) rotateY(${(s.x * 2 * maxTilt).toFixed(3)}deg)`;
      for (const { n, d } of layers) {
        n.style.transform = `translate3d(${(-s.x * 2 * d).toFixed(2)}px, ${(-s.y * 2 * d).toFixed(2)}px, 0)`;
      }
      light.style.transform = `translate3d(${s.mx.toFixed(1)}px, ${s.my.toFixed(1)}px, 0) translate(-50%, -50%)`;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000 || 1 / 60, 1 / 30);
      last = t;
      s.vx += (STIFFNESS * (s.tx - s.x) - DAMPING * s.vx) * dt;
      s.vy += (STIFFNESS * (s.ty - s.y) - DAMPING * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = 1 - Math.pow(0.0008, dt);
      s.mx += (s.tmx - s.mx) * k;
      s.my += (s.tmy - s.my) * k;
      render();
      const settled =
        Math.abs(s.tx - s.x) < 0.0005 && Math.abs(s.ty - s.y) < 0.0005 && Math.abs(s.vx) + Math.abs(s.vy) < 0.001;
      if (!hovering && settled) {
        s.x = s.y = s.vx = s.vy = 0;
        el.style.transform = "";
        for (const { n } of layers) n.style.transform = "";
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
      // wide cards tilt less so their far edge never swings too deep
      maxTilt = rect.width > 900 ? 2.2 : rect.width > 600 ? 3.5 : 5;
      aim(e);
      s.mx = s.tmx;
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
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] will-change-transform",
        className,
      )}
    >
      {/* gradient hairline: static tinted border + a rotating comet that brightens on hover / focus */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[24px]" style={{ background: w.border }}>
        <div
          className={cn(
            "eco-anim eco-spin absolute left-1/2 top-1/2 aspect-square w-[260%] opacity-40 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
            spin === "b" && "eco-spin-b",
            spin === "c" && "eco-spin-c",
          )}
          style={{ background: w.ring, animationDuration: "9s" }}
        />
      </div>
      {/* tinted surface, inset by the 1px border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px -z-10 overflow-hidden rounded-[23px]"
        style={{ background: w.surface }}
      >
        {/* hover: the colour world intensifies */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
          style={{ background: w.hover }}
        />
        {/* fine noise of light: a soft dot lattice in the accent colour */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `radial-gradient(rgba(${w.rgb},0.16) 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(180deg, transparent 40%, #000 75%, transparent 100%)",
          }}
        />
        <div
          ref={spot}
          className="absolute left-0 top-0 size-[560px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
          style={{ background: w.spot }}
        />
      </div>
      {/* inner glow edges: lit top hairline + accent rim, above the art */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px z-[5] rounded-[23px] transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(${w.rgb},0.10), inset 0 -60px 90px -70px rgba(${w.rgb},0.55)`,
        }}
      />
      {children}
    </article>
  );
}
