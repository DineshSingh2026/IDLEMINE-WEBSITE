import Image from "next/image";
import type { Viewport } from "next";
import { pageMeta } from "@/lib/seo";
import { getTokenStats } from "@/lib/market";
import { liquidityHero, liquidityMeta, poolsSection } from "@/data/content/liquidity";
import { TickerBand } from "@/components/home/TickerBand";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Grain } from "@/components/layout/Grain";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { AssetRail } from "@/components/liquidity/AssetRail";
import { PoolList } from "@/components/liquidity/PoolList";

export const metadata = pageMeta(liquidityMeta);
export const viewport: Viewport = { themeColor: "#07061f" };
export const revalidate = 60;

export default async function LiquidityPage() {
  const initial = await getTokenStats();
  return (
    <div className="bg-bg-deep">
      <TickerBand
        initial={initial}
        fields={[
          { label: "$IDLE price", key: "priceUsd", format: "price", roll: true },
          { label: "Total liquidity", key: "liquidityUsd", format: "usd", roll: true },
          { label: "Total volume", key: "totalVolume", format: "usd", roll: true },
          { label: "Pools", key: "pairs", format: "int" },
        ]}
      />

      <section aria-labelledby="liquidity-title" className="relative isolate overflow-hidden pb-20 pt-16 md:pb-28 md:pt-24">
        <div aria-hidden className="absolute inset-0 -z-10">
          <BackgroundBlobs
            blobs={[
              { color: "teal", pos: { top: "40%", left: "78%" }, size: 720, opacity: 0.4 },
              { color: "violet", pos: { top: "10%", left: "10%" }, size: 560, opacity: 0.25 },
              { color: "gold", pos: { top: "90%", left: "45%" }, size: 520, opacity: 0.12 },
            ]}
          />
          <Grain />
        </div>
        <Container className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
          <div className="min-w-0">
            <Eyebrow>{liquidityHero.eyebrow}</Eyebrow>
            <Heading as="h1" id="liquidity-title" size="xl" immediate className="text-display-xl mt-6">
              {liquidityHero.title}
            </Heading>
            <p className="text-body-l mt-6 max-w-[600px]">{liquidityHero.sub}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {liquidityHero.chips.map((c, i) => (
                <li key={c}>
                  <Chip tone={(["mint", "gold", "violet"] as const)[i % 3]}>{c}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[420px]">
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-teal/40 blur-[80px]" />
            <div aria-hidden className="absolute inset-0 rounded-full border border-white/5" />
            <div aria-hidden className="absolute inset-[-8%] rounded-full border border-dashed border-white/[0.06]" />
            <Image
              src={liquidityHero.visual}
              alt="IdleMine Web 3.0 logo"
              width={640}
              height={640}
              priority
              sizes="(min-width: 1024px) 420px, 80vw"
              className="float-y relative w-full drop-shadow-[0_30px_80px_rgba(15,163,160,0.45)]"
            />
          </div>
        </Container>
        <div className="mt-16 md:mt-20">
          <AssetRail />
        </div>
      </section>

      <Section id="pools" ariaLabelledby="pools-title" className="pt-8 md:pt-12 lg:pt-16" blobs={[{ color: "violet", pos: { top: "30%", left: "90%" }, opacity: 0.18 }]}>
        <div className="max-w-[720px]">
          <Heading id="pools-title" size="l" className="text-display-l">
            {poolsSection.title}
          </Heading>
          <Reveal>
            <p className="text-body-l mt-5">{poolsSection.body}</p>
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <PoolList initial={initial} />
        </Reveal>
      </Section>
    </div>
  );
}
