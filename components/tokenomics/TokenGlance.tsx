"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { Reveal } from "@/components/ui/Reveal";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { StatNumber } from "@/components/ui/StatNumber";
import { glance, hero, logos } from "@/data/content/tokenomics";
import { useTokenStats } from "@/hooks/useTokenStats";
import type { TokenStats } from "@/lib/token";
import { cn } from "@/lib/utils";

function Note({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-line px-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">
      {live && <span aria-hidden className="size-1.5 rounded-full bg-mint" />}
      {children}
    </span>
  );
}

function Row({ label, children, note, className }: { label: string; children: React.ReactNode; note?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 border-t border-line px-6 py-5 sm:px-8 md:py-6", className)}>
      <dt className="flex items-center gap-2.5 text-sm text-ink-2">
        {label}
        {note}
      </dt>
      <dd className="min-w-0 font-mono text-[17px] font-medium text-ink md:text-lg">{children}</dd>
    </div>
  );
}

/** "Token at a glance" data card with live market values. */
export function TokenGlance({ initial }: { initial: TokenStats }) {
  const { stats } = useTokenStats(initial);
  const r = glance.rows;

  return (
    <section aria-labelledby="tk-glance" className="relative">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
            {/* Header strip */}
            <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:py-8">
              <div className="flex items-center gap-4">
                <span className="relative size-14 shrink-0 rounded-full border border-line bg-surface-2 p-2">
                  <Image src={hero.mark.src} alt="" width={56} height={56} className="size-full object-contain" />
                </span>
                <div>
                  <h2 id="tk-glance" className="text-eyebrow">
                    {glance.title}
                  </h2>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">
                    {r.name.value} <span className="text-ink-2">{r.ticker.value}</span>
                  </p>
                </div>
              </div>
              <dl className="flex flex-col gap-2 md:items-end">
                <dt className="flex items-center gap-2.5 text-sm text-ink-2">
                  {r.price.label}
                  <Note live>{r.price.note}</Note>
                </dt>
                <dd className="font-mono text-[40px] font-medium leading-none tracking-[-0.03em] text-ink md:text-5xl">
                  <RollingNumber value={stats.priceUsd} format="price" />
                </dd>
              </dl>
            </div>

            <dl className="grid sm:grid-cols-2 sm:[&>div:nth-child(even)]:border-l">
              <Row label={r.name.label}>{r.name.value}</Row>
              <Row label={r.ticker.label}>
                <span className="text-teal-400">{r.ticker.value}</span>
              </Row>
              <Row label={r.chain.label}>
                <span className="inline-flex items-center gap-2.5">
                  <Image src={logos.solana} alt="" width={22} height={20} className="h-[18px] w-auto" />
                  {r.chain.value}
                </span>
              </Row>
              <Row label={r.marketCap.label} note={<Note live>{r.marketCap.note}</Note>}>
                <RollingNumber value={stats.marketCap} format="usd" />
              </Row>
              <Row label={r.totalSupply.label} note={<Note>{r.totalSupply.note}</Note>}>
                <StatNumber value={stats.totalSupply} format="supply" />
              </Row>
              <Row label={r.circulating.label} note={<Note live>{r.circulating.note}</Note>}>
                <StatNumber value={stats.circulatingSupply} format="supply" />
              </Row>
              <Row
                label={r.contract.label}
                className="bg-surface-2/50 sm:col-span-2 sm:!border-l-0 md:flex-row md:items-center md:justify-between"
              >
                <span className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <CopyAddress address={r.contract.value} />
                  <a
                    href={glance.solscan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 font-sans text-sm font-semibold text-teal-400 transition-colors duration-200 ease-out hover:text-teal-300"
                  >
                    {glance.solscan.label}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </span>
              </Row>
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
