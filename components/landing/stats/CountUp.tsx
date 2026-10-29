"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1200;

export type CountFormat = "int" | "usd" | "millions";
const int = (n: number) => Math.round(n).toLocaleString("en-US");
/** "millions" renders the dollar figure only ($200); the caller sets the "Million" unit beside it. */
const formats: Record<CountFormat, (n: number) => string> = {
  int,
  usd: (n) => "$" + int(n),
  millions: (n) => "$" + int(n),
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to `value` once, when it first scrolls into view.
 * - SSR / no-JS: renders the final string (never zeros).
 * - The final string is also laid out invisibly underneath, so the width never changes (CLS = 0).
 * - Reduced motion, or already on screen at hydration: stays on the final value.
 */
export function CountUp({ value, format: kind }: { value: number; format: CountFormat }) {
  const format = formats[kind];
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = el.getBoundingClientRect();
    const onScreen = r.top < window.innerHeight && r.bottom > 0;
    if (reduce || onScreen || typeof IntersectionObserver === "undefined") return;

    setShown(0); // off-screen, so the swap is never seen
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          setShown(p === 1 ? value : value * easeOut(p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const final = format(value);
  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="sr-only">{final}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {format(shown)}
      </span>
    </span>
  );
}
