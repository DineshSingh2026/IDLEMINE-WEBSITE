import { ArrowUpRight } from "lucide-react";
import { rwa, header } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { AssetTile } from "./rwa/AssetTile";
import { MonoFilters } from "./rwa/monoFilters";

/** §5 Real World Assets x $IDLE — logo wall of tokenized assets paired with $IDLE. */
export function Rwa() {
  const ctaAria = `${rwa.cta.label}: Raydium liquidity pools (opens in a new tab)`;
  return (
    <Section
      id={rwa.id}
      ariaLabelledby="rwa-title"
      className="scroll-mt-[var(--header-h)] border-y border-line bg-teal-900/30"
    >
      <MonoFilters />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-8">
          <Reveal>
            <Eyebrow className="text-teal-400">{header.rwa.label}</Eyebrow>
          </Reveal>
          <Heading id="rwa-title" className="mt-5 max-w-[16ch]" highlight={["$IDLE"]}>
            {rwa.title}
          </Heading>
          <Reveal delay={0.1}>
            <p className="text-body-l mt-6 max-w-[56ch] text-pretty">{rwa.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="hidden lg:col-span-4 lg:flex lg:justify-end">
          <Button href={rwa.cta.href} variant="secondary" ariaLabel={ctaAria}>
            {rwa.cta.label}
          </Button>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <ul
          aria-label="Tokenized assets paired with $IDLE"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-4 lg:mt-16 lg:grid-cols-7"
        >
          {rwa.assets.map((a) => (
            <li key={a.ticker}>
              <AssetTile asset={a} pairSuffix={rwa.pairSuffix} />
            </li>
          ))}
          {/* 8th cell completes the grid below desktop; on desktop the CTA sits in the header. */}
          <li className="lg:hidden">
            <a
              href={rwa.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ctaAria}
              className="group/more flex h-full min-h-[180px] flex-col items-center justify-center gap-5 bg-bg/70 px-3 text-center transition-colors duration-[250ms] ease-out hover:bg-surface focus-visible:bg-surface"
            >
              <span className="flex size-14 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-[250ms] group-hover/more:border-teal-400 group-hover/more:text-teal-400 md:size-[72px]">
                <ArrowUpRight aria-hidden className="size-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{rwa.cta.label}</span>
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-[80ch] text-[13px] leading-5 text-ink-3">{rwa.note}</p>
      </Reveal>
    </Section>
  );
}
