import Image from "next/image";
import type { PoolStat } from "@/lib/token";
import { StatNumber } from "@/components/ui/StatNumber";
import { Badge } from "@/components/ui/Badge";
import { poolsSection } from "@/data/content/liquidity";

/** Featured IDLE / SOL pool with live metrics from DexScreener. */
export function PoolCard({ pool, children }: { pool?: PoolStat; children?: React.ReactNode }) {
  const m = poolsSection.metrics;
  const metrics = [
    { label: m.liquidity, value: pool?.liquidityUsd, format: "usd" as const },
    { label: m.volume, value: pool?.volume24h, format: "usd" as const },
    { label: m.txns, value: pool?.txns24h, format: "int" as const },
    { label: m.price, value: pool?.priceUsd, format: "price" as const },
  ];
  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/25 bg-[linear-gradient(160deg,rgba(245,197,66,0.10),rgba(15,17,25,0.92)_40%,rgba(153,69,255,0.10))] p-6 shadow-[0_40px_160px_-60px_rgba(245,197,66,0.45)] md:p-10">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-gold/15 blur-[90px]" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="relative flex">
            <Image src="/assets/img/idlemine-mark.webp" alt="" width={44} height={44} className="size-11 rounded-full ring-2 ring-bg-deep" />
            <span
              aria-hidden
              className="-ml-3 grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#9945ff,#14f195)] font-mono text-[11px] font-bold text-white ring-2 ring-bg-deep"
            >
              SOL
            </span>
          </span>
          <h3 className="text-heading-m text-ink">{poolsSection.cardTitle}</h3>
        </div>
        <Badge status="live">Raydium</Badge>
      </div>
      <dl className="relative mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
        {metrics.map((x) => (
          <div key={x.label} className="bg-bg-deep/90 p-5 md:p-6">
            <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">{x.label}</dt>
            <dd className="mt-2 font-mono text-xl font-semibold text-ink md:text-2xl">
              <StatNumber value={x.value} format={x.format} />
            </dd>
          </div>
        ))}
      </dl>
      {children && <div className="relative mt-8">{children}</div>}
    </div>
  );
}
