"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useTokenStats } from "@/hooks/useTokenStats";
import type { TokenStats } from "@/lib/token";
import { LiveCounter } from "@/components/ui/LiveCounter";
import { cn } from "@/lib/utils";
import { advance, fmtInt, fmtUsdFull, txRate, txTarget, volRate, volTarget } from "./live";

export type StatItem = { label: string; value: number; format: "int" | "usd" | "millions" };

const COUNT_MS = 1300;
const STAGGER_MS = 110;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * static  — SSR / reduced motion / already on screen at hydration: final values, no entrance.
 * armed   — off screen after hydration: tiles hidden + numbers at 0 (never seen).
 * in      — scrolled into view: staggered entrance + count-up.
 * live    — count-up done (or skipped): running totals tick every second.
 */
type Phase = "static" | "armed" | "in" | "live";

export function StatsBand({
  items,
  initial,
  serverNow,
}: {
  items: readonly StatItem[];
  initial?: TokenStats;
  serverNow: number;
}) {
  const { stats } = useTokenStats(initial);
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");
  const [reduce, setReduce] = useState(false);
  const [elapsed, setElapsed] = useState(COUNT_MS * 10); // count-up clock (ms); "done" by default

  // Running totals (fractional accumulators); first values use the server's clock so SSR === hydration.
  const [tx, setTx] = useState(() => txTarget(serverNow, stats));
  const [vol, setVol] = useState(() => volTarget(serverNow, stats));
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const last = useRef(serverNow);

  const step = () => {
    const s = statsRef.current;
    const t = Date.now();
    const dt = (t - last.current) / 1000;
    last.current = t;
    setTx((a) => advance(a, txTarget(t, s), dt, txRate(s)));
    setVol((a) => {
      const target = volTarget(t, s);
      if (target == null) return null;
      return a == null ? target : advance(a, target, dt, volRate(s));
    });
  };

  // Mount: decide reveal behaviour.
  useEffect(() => {
    const el = ref.current;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    step();
    if (!el || rm || typeof IntersectionObserver === "undefined") return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setPhase("live");
      return;
    }
    setPhase("armed");
    setElapsed(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        setPhase("in");
        const start = performance.now();
        const total = COUNT_MS + STAGGER_MS * (items.length - 1);
        const tick = (n: number) => {
          const ms = n - start;
          setElapsed(ms);
          if (ms < total) raf = requestAnimationFrame(tick);
          else setPhase("live");
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live ticking: every second with motion; reduced motion updates silently on each 15s data refresh.
  useEffect(() => {
    if (reduce) return;
    if (phase !== "live" && phase !== "in") return;
    const id = window.setInterval(step, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduce]);
  useEffect(() => {
    if (reduce) step();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, reduce]);

  const progress = (i: number) =>
    phase === "armed" ? 0 : easeOut(Math.min(1, Math.max(0, (elapsed - i * STAGGER_MS) / COUNT_MS)));

  const spot = (e: PointerEvent<HTMLDivElement>) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", `${e.clientX - r.left}px`);
    t.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      data-phase={phase}
      className="sb-panel relative mt-12 overflow-hidden rounded-[20px] border border-line"
    >
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1.2fr)_minmax(0,1.42fr)_minmax(0,0.78fr)_minmax(0,1fr)]">
        {items.map((item, i) => {
          const p = progress(i);
          const isTx = item.label === "Total Transactions";
          const isVol = item.label === "Trading Volume";
          const fullVol = isVol && vol != null;
          const live = (isTx && txRate(stats) != null) || (fullVol && volRate(stats) != null);
          const rolling = live && phase === "live" && !reduce;

          let text: string;
          let reserve: string;
          if (isTx) {
            text = fmtInt(tx * p);
            reserve = fmtInt(tx);
          } else if (fullVol) {
            text = fmtUsdFull(vol * p);
            reserve = fmtUsdFull(vol);
          } else {
            const f = item.format === "int" ? fmtInt : fmtUsdFull;
            text = f(Math.round(item.value * p));
            reserve = f(item.value);
          }

          return (
            <div
              key={item.label}
              onPointerMove={spot}
              className={cn(
                "sb-tile group relative isolate flex flex-col bg-surface px-6 pb-7 pt-6 xl:min-h-[260px] xl:px-5 xl:pb-8 xl:pt-7 2xl:px-6",
                i === items.length - 1 && "md:col-span-2 xl:col-span-1",
              )}
              style={{ "--d": `${i * STAGGER_MS}ms` } as React.CSSProperties}
            >
              <div className="flex h-4 items-center justify-between gap-3">
                <span aria-hidden className="sb-rule block h-[2px] w-8 rounded-full bg-teal-400" />
                {live && (
                  <span className="sb-fade inline-flex items-center gap-2 font-mono text-[11px] leading-4 tracking-[0.04em] text-ink-3">
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span aria-hidden className="sb-ping absolute inset-0 rounded-full bg-mint" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
                    </span>
                    Live · DexScreener
                  </span>
                )}
              </div>

              <p className="mt-10 whitespace-nowrap font-display font-semibold leading-none tracking-[-0.035em] text-ink text-[clamp(36px,11vw,56px)] md:text-[clamp(36px,5.2vw,56px)] xl:mt-auto xl:text-[clamp(28px,2.55vw,44px)]">
                <LiveCounter text={text} reserve={reserve} rolling={rolling} />
                {isVol && !fullVol && (
                  <>
                    {" "}
                    <span className="align-baseline text-[0.42em] font-medium tracking-[-0.01em] text-ink-2">
                      Million
                    </span>
                  </>
                )}
              </p>
              <p className="sb-label mt-4 max-w-[24ch] text-[14px] leading-5 text-ink-2 xl:min-h-[60px]">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Ambient layers: a slow light sweep and a travelling teal→mint hairline. */}
      <span aria-hidden className="sb-sweep pointer-events-none absolute inset-0 z-10" />
      <span aria-hidden className="sb-line pointer-events-none absolute inset-x-0 top-0 z-20 h-px" />
    </div>
  );
}
