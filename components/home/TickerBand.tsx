"use client";

import { ArrowUpRight } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import type { TokenStats } from "@/lib/token";
import type { StatFormat } from "@/lib/format";
import { fmtPct } from "@/lib/format";
import { StatNumber } from "@/components/ui/StatNumber";
import { Container } from "@/components/layout/Container";
import { links } from "@/data/content/site";
import { cn } from "@/lib/utils";

export type TickerField =
  | { label: string; key: keyof TokenStats; format: StatFormat; change?: boolean }
  | { label: string; fixed: number; format: StatFormat };

/**
 * Thin live stat strip (solana.com-style). Mono numbers, 60s refresh, gold flash on change.
 * Home: price · market cap · total volume · 24h trades · games live.
 * Liquidity: price · total liquidity · total volume · pools.
 */
export function TickerBand({ fields, initial, className }: { fields: TickerField[]; initial?: TokenStats; className?: string }) {
  const { stats } = useTokenStats(initial);
  const change = stats.priceChange24h;

  return (
    <div className={cn("relative border-b border-line bg-[rgba(8,9,14,0.6)] backdrop-blur-md", className)}>
      <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-x-10">
          {fields.map((f) => {
            const value = "fixed" in f ? f.fixed : (stats[f.key] as number | null);
            return (
              <div key={f.label} className="min-w-0">
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
                  {"key" in f && <span aria-hidden className={cn("size-1.5 rounded-full", stats.ok ? "bg-mint" : "bg-ink-3")} />}
                  {f.label}
                </dt>
                <dd className="mt-1 flex items-baseline gap-2 font-mono text-[15px] font-semibold text-ink">
                  <StatNumber value={value} format={f.format} />
                  {"change" in f && f.change && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        change == null ? "text-ink-3" : change >= 0 ? "text-mint" : "text-[#FF6B6B]",
                      )}
                    >
                      {change == null ? "—" : fmtPct(change)}
                      <span className="sr-only"> 24 hour change</span>
                    </span>
                  )}
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
