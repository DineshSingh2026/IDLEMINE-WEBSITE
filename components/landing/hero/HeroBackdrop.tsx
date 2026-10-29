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
 * Reduced motion → the particle mark renders one settled still frame.
 */
export function HeroBackdrop({ anchor }: { anchor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"idle" | "gl" | "static">("idle");
  const [still, setStill] = useState(false);
  const [ready, setReady] = useState(false);

  const setHost = useCallback((v: "gl" | "static") => {
    const section = ref.current?.closest("section");
    if (section) section.dataset.hero = v;
  }, []);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const ok = canRunField();
    setMode(ok ? "gl" : "static");
    setHost(ok ? "gl" : "static");
  }, [setHost]);

  const onReady = useCallback(() => setReady(true), []);
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
    </div>
  );
}
