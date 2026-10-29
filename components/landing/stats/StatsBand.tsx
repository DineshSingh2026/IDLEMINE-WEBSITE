"use client";

import { useEffect, useRef, useState } from "react";
import { useTokenStats } from "@/hooks/useTokenStats";
import type { TokenStats } from "@/lib/token";
import { LiveCounter } from "@/components/ui/LiveCounter";
import { cn } from "@/lib/utils";
import { advance, fmtInt, fmtUsdFull, txRate, txTarget, volRate, volTarget } from "./live";

export type StatItem = {
  label: string;
  value: number;
  format: "int" | "usd" | "millions" | "percent";
  /** Appended after the number, e.g. "+" for "25+". */
  suffix?: string;
  /** Not a live feed: random-walks around `value`, held within ±wander (a fraction, e.g. 0.005 = ±0.5%). */
  wander?: number;
};

/**
 * pair — the §3 Stats figures (Users, Transactions, Games): one column on phones, two from md (Games
 *        wraps under the first), three columns from lg. Sizes are capped so "11,358,172" fits a column.
 * quad — the four-up strip after the RWA section: stacked, then 2×2 from md, then four columns from xl.
 *        The grid is a size container and each number is capped to its column width (Q_FIT), so the
 *        longest live figure (full trading volume) never runs into the next column or past the page
 *        edge, where body's `overflow-x: clip` would cut its last wheels off mid-roll.
 */
export type StatsLayout = "pair" | "quad";

const GRID: Record<StatsLayout, string> = {
  pair: "grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:grid-cols-3 lg:gap-y-0",
  quad: "grid grid-cols-1 gap-y-12 [container-type:inline-size] md:grid-cols-2 md:gap-y-14 xl:grid-cols-4 xl:gap-y-0",
};
/** Widest figure the quad strip must fit, in em ("$999,999,999" plus headroom). */
const Q_FIT = 7;
// Column content width ÷ Q_FIT caps the size per breakpoint. md: two columns, the even one indented 40px
// for its hairline; xl: four columns, inner ones padded 20px a side (the outer ones only on one side).
const NUM: Record<StatsLayout, string> = {
  pair: "text-[clamp(40px,12vw,54px)] md:text-[clamp(44px,5.8vw,64px)] lg:text-[clamp(36px,4.2vw,52px)]",
  quad:
    "text-[length:min(clamp(40px,12vw,54px),calc(100cqi/var(--q-fit)))] " +
    "md:text-[length:min(clamp(44px,5.8vw,64px),calc((50cqi_-_40px)/var(--q-fit)))] " +
    "xl:text-[length:min(clamp(34px,2.78vw,40px),calc((25cqi_-_40px)/var(--q-fit)))]",
};

const COUNT_MS = 1300;
const STAGGER_MS = 110;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Wander cadence: a new step every 1–2 s. */
const WANDER_MIN_MS = 1000;
const WANDER_JITTER_MS = 1000;
type Walk = { v: number; dir: "up" | "down" };

/**
 * One random-walk step around `base`: mostly ±1–8 (rarely up to ~60), up 58% of the time at the base,
 * pulled back toward it the further it strays, and hard-clamped to ±span of the base.
 */
function wanderStep(cur: number, base: number, span: number): Walk {
  const lim = base * span;
  const dev = (cur - base) / lim; // -1 … 1
  const pUp = Math.min(0.9, Math.max(0.1, 0.58 - 0.45 * dev));
  const size = 1 + Math.floor(Math.random() ** 3 * 60);
  const up = Math.random() < pUp;
  const v = Math.round(Math.min(base + lim, Math.max(base - lim, cur + (up ? size : -size))));
  return { v, dir: v < cur ? "down" : "up" };
}

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
  layout = "quad",
}: {
  items: readonly StatItem[];
  initial?: TokenStats;
  serverNow: number;
  layout?: StatsLayout;
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

  // Wandering figures (e.g. Total Users): gentle random walk once live; reduced motion keeps the base value.
  const [walk, setWalk] = useState<Record<string, Walk>>({});
  useEffect(() => {
    if (reduce || phase !== "live") return;
    const wanderers = items.filter((it) => it.wander);
    if (!wanderers.length) return;
    let id = 0;
    const tick = () => {
      setWalk((w) => {
        const next = { ...w };
        for (const it of wanderers) next[it.label] = wanderStep(w[it.label]?.v ?? it.value, it.value, it.wander!);
        return next;
      });
      id = window.setTimeout(tick, WANDER_MIN_MS + Math.random() * WANDER_JITTER_MS);
    };
    id = window.setTimeout(tick, WANDER_MIN_MS + Math.random() * WANDER_JITTER_MS);
    return () => window.clearTimeout(id);
  }, [items, phase, reduce]);

  const progress = (i: number) =>
    phase === "armed" ? 0 : easeOut(Math.min(1, Math.max(0, (elapsed - i * STAGGER_MS) / COUNT_MS)));

  return (
    <div ref={ref} data-phase={phase} data-layout={layout} className="sb-panel relative isolate mt-10 lg:mt-12">
      {/* Borderless brand light: blurred teal / mint / violet glows drifting slowly behind the figures. */}
      <div aria-hidden className="pointer-events-none absolute -inset-y-24 inset-x-0 -z-10">
        <div className="sb-glow sb-glow-a absolute left-[-6%] top-[8%] h-[80%] w-[52%]" />
        <div className="sb-glow sb-glow-b absolute left-[34%] top-[18%] h-[72%] w-[46%]" />
        <div className="sb-glow sb-glow-c absolute right-[-4%] top-[4%] h-[70%] w-[38%]" />
      </div>

      <div className={GRID[layout]} style={{ "--q-fit": Q_FIT } as React.CSSProperties}>
        {items.map((item, i) => {
          const p = progress(i);
          const isTx = item.label === "Total Transactions";
          const isVol = item.label === "Trading Volume";
          const fullVol = isVol && vol != null;
          const live = (isTx && txRate(stats) != null) || (fullVol && volRate(stats) != null);
          const wander = item.wander ? walk[item.label] : undefined;
          // Wandering figures roll like the live ones but carry no "Live" pill: they are not a feed.
          const rolling = (live || !!item.wander) && phase === "live" && !reduce;
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
            const f =
              item.format === "int" ? fmtInt : item.format === "percent" ? (n: number) => `${fmtInt(n)}%` : fmtUsdFull;
            const sfx = item.suffix ?? "";
            text = f(Math.round((wander?.v ?? item.value) * p)) + sfx;
            // Wanderers reserve their ceiling (same digit count; tabular figures keep every tick the same width).
            reserve = f(Math.round(item.value * (1 + (item.wander ?? 0)))) + sfx;
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
                  "sb-num mt-6 whitespace-nowrap font-display font-semibold leading-none tracking-[-0.04em] xl:mt-7",
                  NUM[layout],
                  accent && "sb-num-mint",
                )}
              >
                <LiveCounter text={text} reserve={reserve} rolling={rolling} dir={wander?.dir} />
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
