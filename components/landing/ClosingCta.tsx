import { hero } from "@/data/content/landing";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaPanel, CtaEmblem } from "./cta/CtaPanel";
import { CtaHeading } from "./cta/CtaHeading";

/**
 * Closing CTA band (between FAQs and the footer). Reuses the hero copy verbatim:
 * the H1 as an H2, plus the two hero buttons. No new marketing copy.
 */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-cta-title" className="relative pb-16 md:pb-24 lg:pb-[120px]">
      <Container>
        <CtaPanel>
          <div className="flex min-h-[540px] flex-col items-center justify-center px-5 py-16 text-center sm:px-10 md:min-h-[600px] md:py-24 lg:min-h-[640px]">
            <Reveal>
              <CtaEmblem />
            </Reveal>
            <CtaHeading
              id="closing-cta-title"
              text={hero.title}
              highlight="Agentic Economies"
              className="mt-10 max-w-[15ch] text-[40px] leading-[1.04] font-semibold tracking-[-0.04em] font-display sm:text-[56px] md:mt-12 lg:max-w-[17ch] lg:text-[clamp(60px,5.6vw,80px)]"
            />
            <Reveal delay={0.55}>
              <div aria-hidden className="mx-auto mt-8 h-px w-28 bg-[linear-gradient(90deg,#00C6C9_0%,#9B7BFF_100%)]" />
            </Reveal>
            <Reveal delay={0.7} className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
              <Button href={hero.primary.href} variant="primary" icon="external">
                {hero.primary.label}
              </Button>
              <Button href={hero.secondary.href} variant="secondary" icon="arrow" className="bg-bg/40">
                {hero.secondary.label}
              </Button>
            </Reveal>
          </div>
        </CtaPanel>
      </Container>
    </section>
  );
}
