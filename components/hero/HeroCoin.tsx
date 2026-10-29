"use client";

import { Component, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CoinScene = dynamic(() => import("./CoinScene"), { ssr: false, loading: () => null });

/** Swallows WebGL / asset errors so the static coin simply stays in place. */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type NavigatorExtras = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

function canRender3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as NavigatorExtras;
  if ((nav.hardwareConcurrency ?? 8) <= 4) return false;
  if (nav.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

/** Static coin: the IdleMine emblem inside a gold conic ring with a warm glow. Same footprint as the 3D coin. */
export function CoinFallback({ animate = true, className }: { animate?: boolean; className?: string }) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center", className)} aria-hidden>
      <div className={cn("relative aspect-square w-[76%]", animate && "float-y")}>
        {/* rim */}
        <div
          className="absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgba(0,198,201,0.55),0_0_120px_rgba(0,198,201,0.18)]"
          style={{
            background:
              "conic-gradient(from 210deg, #8a5a12, #00C6C9, #fff1c2, #e0a531, #7a4c0e, #00C6C9, #4DD9DB, #b67c1c, #8a5a12)",
          }}
        />
        {/* reeded edge hint */}
        <div
          className="absolute inset-[1.2%] rounded-full opacity-40 mix-blend-overlay"
          style={{ background: "repeating-conic-gradient(#000 0deg 1deg, transparent 1deg 2.25deg)" }}
        />
        {/* bevel lip */}
        <div
          className="absolute inset-[5%] rounded-full"
          style={{
            background: "linear-gradient(145deg, #ffe9a8 0%, #018082 45%, #6e430b 100%)",
            boxShadow: "inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -4px 10px rgba(0,0,0,0.45)",
          }}
        />
        {/* inset face */}
        <div className="absolute inset-[9%] overflow-hidden rounded-full bg-[#06595a] shadow-[inset_0_6px_24px_rgba(0,0,0,0.55),0_0_60px_rgba(15,163,160,0.45)]">
          <Image
            src="/assets/img/idlemine-mark.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 70vw"
            className="scale-[0.9] object-contain"
            priority
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,rgba(255,255,255,0.28),transparent_45%)]" />
        </div>
      </div>
    </div>
  );
}

/**
 * The $IDLE hero coin. Fills its container as a square.
 * Renders the static coin on the server and until the 3D scene has drawn its first frame; keeps it
 * permanently for reduced motion, low-power devices, Save-Data, or no WebGL.
 */
export function HeroCoin({ className }: { className?: string }) {
  const [mode, setMode] = useState<"static" | "3d">("static");
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (canRender3D()) setMode("3d");
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setReady(false);
    setMode("static");
  }, []);

  return (
    <div className={cn("relative isolate aspect-square w-full", className)} aria-hidden>
      {/* Halo: gold core, violet / mint underglow */}
      <div className="pointer-events-none absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.22),transparent_62%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-[14%] bottom-[2%] top-[56%] -z-10 rounded-full bg-[radial-gradient(ellipse_at_30%_50%,rgba(155,123,255,0.35),transparent_60%),radial-gradient(ellipse_at_70%_50%,rgba(61,245,176,0.22),transparent_60%)] blur-3xl" />

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-quint",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <CoinFallback animate={!reduce} />
      </div>

      {mode === "3d" && (
        <SceneBoundary onError={onError}>
          <Suspense fallback={null}>
            <CoinScene
              onReady={onReady}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-quint",
                ready ? "opacity-100" : "opacity-0",
              )}
            />
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
}

export default HeroCoin;
