"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import { RAYDIUM_POOLS, type PoolStat, type TokenStats } from "@/lib/token";
import { fmtInt, fmtUsd } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { poolsSection, tokenLogos } from "@/data/content/liquidity";
import { PoolCard } from "./PoolCard";
import { DexChartEmbed } from "./DexChartEmbed";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const quoteOf = (p: PoolStat) => p.label.split("/").pop()?.trim() ?? "";
const dexName = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

function TokenIcon({ symbol }: { symbol: string }) {
  const src = tokenLogos[symbol];
  if (src) return <Image src={src} alt="" width={28} height={28} className="size-7 rounded-full ring-2 ring-surface" />;
  if (symbol === "SOL")
    return (
      <span aria-hidden className="grid size-7 place-items-center rounded-full bg-surface-2 ring-2 ring-surface">
        <Image src="/assets/logos/solana.svg" alt="" width={14} height={12} className="h-[11px] w-auto" />
      </span>
    );
  return (
    <span
      aria-hidden
      className="grid size-7 place-items-center rounded-full bg-surface-2 font-mono text-[8px] font-medium text-ink-2 ring-2 ring-surface"
    >
      {symbol.slice(0, 4)}
    </span>
  );
}

/** Featured IDLE / SOL card + "Load Live Pools" → every IDLE pair from DexScreener. */
export function PoolList({ initial }: { initial?: TokenStats }) {
  const { stats } = useTokenStats(initial);
  const [open, setOpen] = useState(false);
  const pools = stats.pools;
  const featured = pools.find((p) => p.label === poolsSection.featuredLabel);
  const maxLiq = Math.max(1, ...pools.map((p) => p.liquidityUsd ?? 0));

  return (
    <>
      <PoolCard pool={featured}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="live-pools"
            className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-teal-500 px-6 text-[15px] font-semibold text-[#05080A] transition-[background-color,transform] duration-200 ease-out hover:bg-teal-400 active:scale-[0.98] active:bg-teal-600"
          >
            <Layers aria-hidden className="size-4" />
            {poolsSection.loadPools}
            {pools.length > 0 && <span className="rounded-[6px] bg-black/15 px-1.5 py-0.5 font-mono text-xs">{pools.length}</span>}
          </button>
          <Button href={RAYDIUM_POOLS} variant="secondary">
            {poolsSection.openRaydium}
          </Button>
        </div>
        <DexChartEmbed />
      </PoolCard>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="live-pools"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mt-6 overflow-hidden rounded-[20px] border border-line bg-surface">
              <div className="hidden grid-cols-[1.6fr_0.8fr_1.4fr_1fr_0.8fr_24px] gap-4 border-b border-line px-6 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3 md:grid">
                <span>Pool</span>
                <span>DEX</span>
                <span>{poolsSection.metrics.liquidity}</span>
                <span>{poolsSection.metrics.volume}</span>
                <span>{poolsSection.metrics.txns}</span>
                <span />
              </div>
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }}
              >
                {pools.map((p) => {
                  const q = quoteOf(p);
                  const share = ((p.liquidityUsd ?? 0) / maxLiq) * 100;
                  return (
                    <motion.li
                      key={p.pairAddress}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } },
                      }}
                      className="border-b border-line last:border-b-0"
                    >
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-2 items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors duration-200 ease-out hover:bg-surface-2 md:grid-cols-[1.6fr_0.8fr_1.4fr_1fr_0.8fr_24px] md:px-6"
                      >
                        <span className="col-span-2 flex items-center gap-3 md:col-span-1">
                          <span className="flex">
                            <TokenIcon symbol="IDLE" />
                            <span className="-ml-2">
                              <TokenIcon symbol={q} />
                            </span>
                          </span>
                          <span className="font-medium text-ink">{p.label}</span>
                        </span>
                        <span className="hidden text-sm text-ink-2 md:block">{dexName(p.dexId)}</span>
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 md:hidden">Liq.</span>
                          <span className="font-mono text-sm text-ink">{fmtUsd(p.liquidityUsd)}</span>
                          <span aria-hidden className="hidden h-1 flex-1 overflow-hidden rounded-full bg-line md:block">
                            <span className="block h-full rounded-full bg-teal-400/70" style={{ width: `${share}%` }} />
                          </span>
                        </span>
                        <span className="flex items-center gap-2 font-mono text-sm text-ink-2">
                          <span className="text-[11px] uppercase tracking-[0.08em] text-ink-3 md:hidden">Vol.</span>
                          {fmtUsd(p.volume24h)}
                        </span>
                        <span className="hidden font-mono text-sm text-ink-2 md:block">{fmtInt(p.txns24h)}</span>
                        <ArrowUpRight
                          aria-hidden
                          className="hidden size-4 text-ink-3 transition-[transform,color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal-300 md:block"
                        />
                        <span className="sr-only">(opens DexScreener in a new tab)</span>
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
