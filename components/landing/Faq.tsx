import { faqs } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "./faq/FaqAccordion";

/** §6 FAQs — title left, single-open accordion right (stacked on mobile). */
export function Faq() {
  return (
    <Section id="faq" ariaLabelledby="faq-title" className="scroll-mt-[var(--header-h)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <Reveal>
              <Eyebrow className="text-teal-400">FAQs</Eyebrow>
            </Reveal>
            <Heading id="faq-title" className="mt-5 max-w-[12ch]">
              Frequently asked questions
            </Heading>
          </div>
        </div>
        <Reveal delay={0.1} className="lg:col-span-8 xl:col-span-7 xl:col-start-6">
          <FaqAccordion items={faqs} />
        </Reveal>
      </div>
    </Section>
  );
}
