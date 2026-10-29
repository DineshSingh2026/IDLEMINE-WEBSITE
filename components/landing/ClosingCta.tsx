import { hero } from "@/data/content/landing";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CtaStage, CtaEmblem } from "./cta/CtaPanel";
import { CtaHeading } from "./cta/CtaHeading";

/**
 * Closing CTA (between FAQs and the footer): a borderless full bleed finale painted on the canvas.
 * Reuses the hero copy verbatim: the H1 as an H2, plus the two hero buttons. No new marketing copy.
 */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-cta-title" className="relative isolate overflow-x-clip py-16 md:py-20 lg:py-24">
      <CtaStage>
        <Container className="flex flex-col items-center text-center">
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
            <div aria-hidden className="mx-auto mt-8 h-px w-32 bg-[linear-gradient(90deg,transparent,#00C6C9_30%,#9B7BFF_70%,transparent)]" />
          </Reveal>
          <Reveal delay={0.7} className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <Button href={hero.primary.href} variant="primary" icon="external">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" icon="arrow" className="border-teal-400/45 bg-teal-900/45 backdrop-blur-sm hover:border-teal-300/80 hover:bg-teal-900/70">
              {hero.secondary.label}
            </Button>
          </Reveal>
        </Container>
      </CtaStage>
    </section>
  );
}
