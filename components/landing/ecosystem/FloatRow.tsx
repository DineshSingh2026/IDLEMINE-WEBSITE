"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const STIFFNESS = 120;
const DAMPING = 16;

/**
 * Borderless chapter row. No container chrome at all: it only owns pointer parallax.
 * While a fine pointer moves anywhere over the row, every descendant marked `data-tilt="<px>"`
 * drifts against the pointer by up to that many px (spring smoothed), so the floating art layers
 * separate in depth. Off for touch and reduced motion. The row stays an <article> because
 * EcoStage groups its scroll parallax layers per article.
 */
export function FloatRow({ className, children }: { className?: string; children: React.ReactNode }) {
  const row = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-tilt]")).map((n) => ({
      n,
      d: Number(n.dataset.tilt) || 0,
    }));
    if (!layers.length) return;

    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let rect: DOMRect | null = null;
    let raf = 0;
    let last = 0;
    let hovering = false;

    const render = () => {
      for (const { n, d } of layers) {
        n.style.transform = `translate3d(${(-s.x * 2 * d).toFixed(2)}px, ${(-s.y * 2 * d).toFixed(2)}px, 0)`;
      }
    };
    const tick = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000 || 1 / 60, 1 / 30);
      last = t;
      s.vx += (STIFFNESS * (s.tx - s.x) - DAMPING * s.vx) * dt;
      s.vy += (STIFFNESS * (s.ty - s.y) - DAMPING * s.vy) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      render();
      const settled =
        Math.abs(s.tx - s.x) < 0.0005 && Math.abs(s.ty - s.y) < 0.0005 && Math.abs(s.vx) + Math.abs(s.vy) < 0.001;
      if (!hovering && settled) {
        s.x = s.y = s.vx = s.vy = 0;
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
      s.tx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
      s.ty = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches || reduce.matches) return;
      hovering = true;
      rect = el.getBoundingClientRect();
      aim(e);
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
    <article ref={row} className={cn("group relative", className)}>
      {children}
    </article>
  );
}
