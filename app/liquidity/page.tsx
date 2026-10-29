import Image from "next/image";
import type { Viewport } from "next";
import { pageMeta } from "@/lib/seo";
import { getTokenStats } from "@/lib/market";
import { liquidityHero, liquidityMeta, poolsSection } from "@/data/content/liquidity";
import { TickerBand } from "@/components/home/TickerBand";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { AssetRail } from "@/components/liquidity/AssetRail";
import { PoolList } from "@/components/liquidity/PoolList";

export const metadata = pageMeta(liquidityMeta);
export const viewport: Viewport = { themeColor: "#05080A" };
export const revalidate = 60;

export default async function LiquidityPage() {
  const initial = await getTokenStats();
  return (
    <div className="bg-bg">
      <TickerBand
        initial={initial}
        fields={[
          { label: "$IDLE price", key: "priceUsd", format: "price", roll: true },
          { label: "Total liquidity", key: "liquidityUsd", format: "usd", roll: true },
          { label: "Total volume", key: "totalVolume", format: "usd", roll: true },
          { label: "Pools", key: "pairs", format: "int" },
        ]}
      />

      <section aria-labelledby="liquidity-title" className="relative overflow-hidden pb-16 pt-14 md:pb-20 md:pt-20 lg:pt-24">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow>{liquidityHero.eyebrow}</Eyebrow>
            <Heading as="h1" id="liquidity-title" size="xl" immediate className="mt-6">
              {liquidityHero.title}
            </Heading>
            <p className="text-body-l mt-6 max-w-[600px]">{liquidityHero.sub}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {liquidityHero.chips.map((c) => (
                <li key={c}>
                  <Chip tone="gold">{c}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[340px] lg:col-span-5 lg:max-w-[400px]">
            <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
              <circle cx="200" cy="200" r="198" fill="none" stroke="#1C2A2F" />
              <circle cx="200" cy="200" r="172" fill="none" stroke="#1C2A2F" strokeDasharray="2 6" />
            </svg>
            <div className="absolute inset-[16%]">
              <Image
                src={liquidityHero.visual}
                alt="IdleMine Web 3.0 logo"
                fill
                priority
                sizes="(min-width: 1024px) 270px, 60vw"
                className="object-contain"
              />
            </div>
          </div>
        </Container>
        <div className="mt-16 border-y border-line py-6 md:mt-20">
          <AssetRail />
        </div>
      </section>

      <Section id="pools" ariaLabelledby="pools-title" className="pt-8 md:pt-12 lg:pt-16">
        <div className="max-w-[720px]">
          <Heading id="pools-title" size="l">
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
