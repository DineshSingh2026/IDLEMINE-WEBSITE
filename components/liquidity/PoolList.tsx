"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import { RAYDIUM_POOLS, type PoolStat, type TokenStats } from "@/lib/token";
import { fmtInt, fmtUsd } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/Reveal";
import { poolsSection, tokenLogos } from "@/data/content/liquidity";
import { PoolCard } from "./PoolCard";
import { DexChartEmbed } from "./DexChartEmbed";

const quoteOf = (p: PoolStat) => p.label.split("/").pop()?.trim() ?? "";
const dexName = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

function TokenIcon({ symbol }: { symbol: string }) {
  const src = tokenLogos[symbol];
  if (src) return <Image src={src} alt="" width={28} height={28} className="size-7 rounded-full ring-2 ring-bg-deep" />;
  const sol = symbol === "SOL";
  return (
    <span
      aria-hidden
      className={
        sol
          ? "grid size-7 place-items-center rounded-full bg-[linear-gradient(135deg,#9945ff,#14f195)] font-mono text-[8px] font-bold text-white ring-2 ring-bg-deep"
          : "grid size-7 place-items-center rounded-full bg-surface-2 font-mono text-[8px] font-bold text-ink-2 ring-2 ring-bg-deep"
      }
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
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-[15px] font-semibold text-[#0B0B0F] shadow-[0_0_0_1px_rgba(245,197,66,0.4),0_8px_32px_-8px_rgba(245,197,66,0.55)] transition-colors duration-300 hover:bg-gold-2 active:scale-[0.98]"
          >
            <Layers aria-hidden className="size-4" />
            {poolsSection.loadPools}
            {pools.length > 0 && <span className="rounded-full bg-black/15 px-2 py-0.5 font-mono text-xs">{pools.length}</span>}
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
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface/70 backdrop-blur-sm">
              <div className="hidden grid-cols-[1.6fr_0.8fr_1.4fr_1fr_0.8fr_24px] gap-4 border-b border-line px-6 py-4 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3 md:grid">
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
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
              >
                {pools.map((p) => {
                  const q = quoteOf(p);
                  const share = ((p.liquidityUsd ?? 0) / maxLiq) * 100;
                  return (
                    <motion.li
                      key={p.pairAddress}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                      }}
                      className="border-b border-line last:border-b-0"
                    >
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-2 items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors duration-300 hover:bg-white/[0.04] md:grid-cols-[1.6fr_0.8fr_1.4fr_1fr_0.8fr_24px] md:px-6"
                      >
                        <span className="col-span-2 flex items-center gap-3 md:col-span-1">
                          <span className="flex">
                            <TokenIcon symbol="IDLE" />
                            <span className="-ml-2">
                              <TokenIcon symbol={q} />
                            </span>
                          </span>
                          <span className="font-semibold text-ink">{p.label}</span>
                        </span>
                        <span className="hidden text-sm text-ink-2 md:block">{dexName(p.dexId)}</span>
                        <span className="flex items-center gap-3">
                          <span className="md:hidden text-[11px] uppercase tracking-[0.12em] text-ink-3">Liq.</span>
                          <span className="font-mono text-sm text-ink">{fmtUsd(p.liquidityUsd)}</span>
                          <span aria-hidden className="hidden h-1 flex-1 overflow-hidden rounded-full bg-white/5 md:block">
                            <span className="block h-full rounded-full bg-gradient-to-r from-gold-deep to-gold" style={{ width: `${share}%` }} />
                          </span>
                        </span>
                        <span className="flex items-center gap-2 font-mono text-sm text-ink-2">
                          <span className="md:hidden font-sans text-[11px] uppercase tracking-[0.12em] text-ink-3">Vol.</span>
                          {fmtUsd(p.volume24h)}
                        </span>
                        <span className="hidden font-mono text-sm text-ink-2 md:block">{fmtInt(p.txns24h)}</span>
                        <ArrowUpRight
                          aria-hidden
                          className="hidden size-4 text-ink-3 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-2 md:block"
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
