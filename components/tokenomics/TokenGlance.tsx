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
    <span className="inline-flex h-5 items-center gap-1.5 rounded-full border border-line px-2 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">
      {live && <span aria-hidden className="size-1.5 rounded-full bg-mint shadow-[0_0_8px_#14F195]" />}
      {children}
    </span>
  );
}

function Row({ label, children, note, className }: { label: string; children: React.ReactNode; note?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 border-t border-line px-6 py-5 sm:px-8 md:py-6", className)}>
      <dt className="flex items-center gap-2.5 text-[13px] font-medium text-ink-3">
        {label}
        {note}
      </dt>
      <dd className="min-w-0 font-mono text-[17px] font-medium text-ink md:text-lg">{children}</dd>
    </div>
  );
}

/** Solana-style "Token at a glance" data card with live market values. */
export function TokenGlance({ initial }: { initial: TokenStats }) {
  const { stats } = useTokenStats(initial);
  const r = glance.rows;

  return (
    <section aria-labelledby="tk-glance" className="relative -mt-6 pb-8 md:-mt-10">
      <Container>
        <Reveal>
          <div className="relative rounded-xl p-px [background:linear-gradient(140deg,rgba(245,197,66,0.55),rgba(255,255,255,0.08)_30%,rgba(255,255,255,0.04)_60%,rgba(153,69,255,0.45))]">
            <div className="relative overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-[#0B0A24]">
              <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-gold/10 blur-[100px]" />
              <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 size-[420px] rounded-full bg-violet/10 blur-[100px]" />

              {/* Header strip */}
              <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:py-8">
                <div className="flex items-center gap-4">
                  <span className="relative size-14 shrink-0 rounded-full bg-gold/10 p-1.5 ring-1 ring-gold/40">
                    <Image src={hero.mark.src} alt="" width={56} height={56} className="size-full object-contain" />
                  </span>
                  <div>
                    <h2 id="tk-glance" className="text-eyebrow">
                      {glance.title}
                    </h2>
                    <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                      {r.name.value} <span className="text-gold">{r.ticker.value}</span>
                    </p>
                  </div>
                </div>
                <dl className="flex flex-col gap-2 md:items-end">
                  <dt className="flex items-center gap-2.5 text-[13px] font-medium text-ink-3">
                    {r.price.label}
                    <Note live>{r.price.note}</Note>
                  </dt>
                  <dd className="font-mono text-[40px] font-semibold leading-none tracking-tight text-ink md:text-5xl">
                    <RollingNumber value={stats.priceUsd} format="price" />
                  </dd>
                </dl>
              </div>

              <dl className="relative grid sm:grid-cols-2 sm:[&>div:nth-child(even)]:border-l">
                <Row label={r.name.label}>{r.name.value}</Row>
                <Row label={r.ticker.label}>
                  <span className="text-gold">{r.ticker.value}</span>
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
                <Row label={r.contract.label} className="sm:col-span-2 sm:!border-l-0 md:flex-row md:items-center md:justify-between">
                  <span className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    <CopyAddress address={r.contract.value} />
                    <a
                      href={glance.solscan.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 font-sans text-sm font-semibold text-gold transition-colors hover:text-gold-2"
                    >
                      {glance.solscan.label}
                      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 ease-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </span>
                </Row>
              </dl>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
