"use client";

import { ArrowUpRight } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import type { TokenStats } from "@/lib/token";
import type { StatFormat } from "@/lib/format";
import { StatNumber } from "@/components/ui/StatNumber";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Container } from "@/components/layout/Container";
import { links } from "@/data/content/site";
import { cn } from "@/lib/utils";

export type TickerField =
  /** `roll`: odometer digits that roll up/down on every live update (the important numbers). */
  | { label: string; key: keyof TokenStats; format: StatFormat; roll?: boolean }
  | { label: string; fixed: number; format: StatFormat };

/**
 * Thin live stat strip (solana.com-style). Mono numbers, 15s refresh.
 * Home: price · market cap · total volume · 24h trades · games live.
 * Liquidity: price · total liquidity · total volume · pools.
 */
export function TickerBand({ fields, initial, className }: { fields: TickerField[]; initial?: TokenStats; className?: string }) {
  const { stats } = useTokenStats(initial);

  return (
    <div className={cn("relative border-b border-line bg-[rgba(8,9,14,0.6)] backdrop-blur-md", className)}>
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-10">
          {fields.map((f) => {
            const live = "key" in f;
            const value = live ? (stats[f.key] as number | null) : f.fixed;
            return (
              <div key={f.label} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
                  {live && <span aria-hidden className={cn("size-1.5 rounded-full", stats.ok ? "bg-mint pulse-dot" : "bg-ink-3")} />}
                  {f.label}
                </dt>
                <dd className="mt-1 font-mono text-[15px] font-semibold text-ink">
                  {live && f.roll ? <RollingNumber value={value} format={f.format} /> : <StatNumber value={value} format={f.format} />}
                </dd>
              </div>
            );
          })}
        </dl>
        <a
          href={links.dexscreener}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1 text-xs text-ink-3 transition-colors hover:text-ink"
        >
          Live market data from DexScreener
          <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Container>
    </div>
  );
}
