"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const MarkField = dynamic(() => import("./MarkField"), { ssr: false, loading: () => null });

type NavigatorExtras = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/** Mirrors the inline pre-paint check in Hero.tsx (HERO_MODE_SCRIPT). */
function canRunField() {
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 2) return false;
  if ((nav.deviceMemory ?? 8) <= 1) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

/**
 * Full-bleed animated backdrop for the hero. Lazy-loads the WebGL particle mark and flips the
 * section's `data-hero` attribute: "gl" hides the static mark, "static" shows it.
 * Also drives two cheap DOM effects:
 *  - `--hs` on the section: 0..1 scroll progress through the hero (CSS parallax on text / mark layer)
 *  - a faint cursor glow (mouse / pen only)
 * Reduced motion → the particle mark renders one settled still frame; no glow, no parallax.
 */
export function HeroBackdrop({ anchor }: { anchor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "gl" | "static">("idle");
  const [still, setStill] = useState(false);
  const [ready, setReady] = useState(false);

  const setHost = useCallback((v: "gl" | "static") => {
    const section = ref.current?.closest("section");
    if (!section) return;
    section.dataset.hero = v;
    // Static mark is visible at once; the GL mark flags itself live from onReady.
    if (v === "static") section.dataset.heroLive = "1";
  }, []);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const ok = canRunField();
    setMode(ok ? "gl" : "static");
    setHost(ok ? "gl" : "static");
  }, [setHost]);

  // Scroll progress + cursor glow (one rAF, only while something changes).
  useEffect(() => {
    const section = ref.current?.closest("section");
    const glow = glowRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let lastP = -1;
    const g = { x: 0, y: 0, tx: 0, ty: 0, o: 0, to: 0, live: false };

    const tick = () => {
      raf = 0;
      const p = Math.min(Math.max(window.scrollY / Math.max(section.offsetHeight, 1), 0), 1);
      if (Math.abs(p - lastP) > 0.0005) {
        lastP = p;
        section.style.setProperty("--hs", p.toFixed(4));
      }
      if (glow && g.live) {
        g.x += (g.tx - g.x) * 0.14;
        g.y += (g.ty - g.y) * 0.14;
        g.o += (g.to - g.o) * 0.08;
        glow.style.transform = `translate3d(${g.x.toFixed(1)}px, ${g.y.toFixed(1)}px, 0)`;
        glow.style.opacity = g.o.toFixed(3);
        const settled = Math.abs(g.tx - g.x) < 0.3 && Math.abs(g.ty - g.y) < 0.3 && Math.abs(g.to - g.o) < 0.004;
        if (!settled) raf = requestAnimationFrame(tick);
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = section.getBoundingClientRect();
      g.tx = e.clientX - r.left;
      g.ty = e.clientY - r.top;
      if (!g.live) {
        g.x = g.tx;
        g.y = g.ty;
      }
      g.live = true;
      g.to = 1;
      kick();
    };
    const onLeave = () => {
      g.to = 0;
      kick();
    };

    window.addEventListener("scroll", kick, { passive: true });
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const onReady = useCallback(() => {
    setReady(true);
    const section = ref.current?.closest("section");
    if (section) section.dataset.heroLive = "1";
  }, []);
  const onFail = useCallback(() => {
    setMode("static");
    setHost("static");
  }, [setHost]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {mode === "gl" && (
        <MarkField
          anchor={anchor}
          still={still}
          onReady={onReady}
          onFail={onFail}
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-700 ease-out",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {/* Cursor glow: faint, wide, follows the pointer with a soft lag. */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 -ml-[260px] -mt-[260px] hidden size-[520px] rounded-full opacity-0 mix-blend-screen will-change-transform lg:block"
        style={{
          background:
            "radial-gradient(circle, rgba(0,198,201,0.085) 0%, rgba(0,198,201,0.04) 32%, rgba(0,198,201,0) 68%)",
        }}
      />
    </div>
  );
}
