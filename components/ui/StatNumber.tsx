"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { formatters, type StatFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Live number: counts up over 1.2s on first reveal, tweens + gold-flashes on later updates.
 * Null renders "—". Reduced motion → plain swap.
 */
export function StatNumber({
  value,
  format,
  className,
}: {
  value: number | null | undefined;
  format: StatFormat;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const fmt = formatters[format];
  const valid = typeof value === "number" && Number.isFinite(value);

  const [shown, setShown] = useState<number | null>(null);
  const [flash, setFlash] = useState(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!valid || !inView) return;
    const to = value as number;
    const from = last.current;
    last.current = to;
    if (reduce) {
      setShown(to);
      return;
    }
    if (from !== null && from !== to) setFlash((f) => f + 1);
    const start = performance.now();
    const dur = from === null ? 1200 : 900;
    const origin = from ?? 0;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(origin + (to - origin) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, valid, inView, reduce]);

  // Before reveal, render the final string invisibly so layout never shifts (CLS = 0).
  const text = !valid ? "—" : shown === null ? fmt(value) : fmt(shown);
  return (
    <span
      ref={ref}
      key={flash}
      className={cn("tabular-nums", flash > 0 && "stat-flash", valid && shown === null && inView === false && "opacity-0", className)}
    >
      {text}
    </span>
  );
}
