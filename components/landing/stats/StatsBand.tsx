"use client";

import { useEffect, useRef, useState } from "react";
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

  return (
    <div ref={ref} data-phase={phase} className="sb-panel relative isolate mt-10 lg:mt-12">
      {/* Borderless brand light: blurred teal / mint / violet glows drifting slowly behind the figures. */}
      <div aria-hidden className="pointer-events-none absolute -inset-y-24 inset-x-0 -z-10">
        <div className="sb-glow sb-glow-a absolute left-[-6%] top-[8%] h-[80%] w-[52%]" />
        <div className="sb-glow sb-glow-b absolute left-[34%] top-[18%] h-[72%] w-[46%]" />
        <div className="sb-glow sb-glow-c absolute right-[-4%] top-[4%] h-[70%] w-[38%]" />
      </div>

      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-y-14 xl:grid-cols-[minmax(0,186fr)_minmax(0,210fr)_minmax(0,258fr)_minmax(0,150fr)_minmax(0,178fr)] xl:gap-y-0">
        {items.map((item, i) => {
          const p = progress(i);
          const isTx = item.label === "Total Transactions";
          const isVol = item.label === "Trading Volume";
          const fullVol = isVol && vol != null;
          const live = (isTx && txRate(stats) != null) || (fullVol && volRate(stats) != null);
          const rolling = live && phase === "live" && !reduce;
          const accent = isTx || isVol;

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
              data-accent={accent ? "mint" : "teal"}
              className="sb-fig relative flex min-w-0 flex-col"
              style={{ "--d": `${i * STAGGER_MS}ms`, "--i": i } as React.CSSProperties}
            >
              <div className="flex h-6 items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "sb-rule block h-[2px] w-8 rounded-full",
                    accent
                      ? "bg-[linear-gradient(90deg,#00C6C9,#3DF5B0)] shadow-[0_0_10px_rgba(61,245,176,0.55)]"
                      : "bg-[linear-gradient(90deg,#018082,#00C6C9)] shadow-[0_0_10px_rgba(0,198,201,0.5)]",
                  )}
                />
                {live && (
                  <span className="sb-fade inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.07] px-2.5 py-0.5 font-mono text-[11px] leading-4 tracking-[0.04em] text-mint/90">
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span aria-hidden className="sb-ping absolute inset-0 rounded-full bg-mint" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
                    </span>
                    Live · DexScreener
                  </span>
                )}
              </div>

              <p
                data-rolling={rolling || undefined}
                className={cn(
                  "sb-num mt-6 whitespace-nowrap font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(40px,12vw,54px)] md:text-[clamp(44px,5.8vw,64px)] xl:mt-7 xl:text-[clamp(34px,2.78vw,40px)]",
                  accent && "sb-num-mint",
                )}
              >
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
              <p className="sb-label mt-4 max-w-[24ch] text-[15px] leading-[1.45] text-[#A9C4C7]">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
