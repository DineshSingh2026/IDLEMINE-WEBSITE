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
    <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface p-6 md:p-10">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#018082,#00C6C9,#3DF5B0)]" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="relative flex">
            <Image src="/assets/img/idlemine-mark.webp" alt="" width={44} height={44} className="size-11 rounded-full ring-2 ring-surface" />
            <span aria-hidden className="-ml-3 grid size-11 place-items-center rounded-full bg-surface-2 ring-2 ring-surface">
              <Image src="/assets/logos/solana.svg" alt="" width={20} height={18} className="h-[16px] w-auto" />
            </span>
          </span>
          <h3 className="text-heading-m text-ink">{poolsSection.cardTitle}</h3>
        </div>
        <Badge status="live">Raydium</Badge>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-line bg-line lg:grid-cols-4">
        {metrics.map((x) => (
          <div key={x.label} className="bg-surface-2 p-5 md:p-6">
            <dt className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{x.label}</dt>
            <dd className="mt-2 font-mono text-xl font-medium text-ink md:text-2xl">
              <StatNumber value={x.value} format={x.format} />
            </dd>
          </div>
        ))}
      </dl>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
