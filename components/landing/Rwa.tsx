import { rwa, header } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RwaShowcase } from "./rwa/RwaShowcase";

/** §5 Real World Assets x $IDLE — animated pairing hub over the tile row of tokenized assets. */
export function Rwa() {
  const ctaAria = `${rwa.cta.label}: Raydium liquidity pools (opens in a new tab)`;
  return (
    <Section id={rwa.id} ariaLabelledby="rwa-title" className="border-y border-line bg-teal-900/30">
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

      <RwaShowcase assets={rwa.assets} pairSuffix={rwa.pairSuffix} cta={rwa.cta} ctaAria={ctaAria} />

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-[80ch] text-[13px] leading-5 text-ink-3">{rwa.note}</p>
      </Reveal>
    </Section>
  );
}
