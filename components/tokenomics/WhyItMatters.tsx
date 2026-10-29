import { Check, X } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { why } from "@/data/content/tokenomics";

export function WhyItMatters() {
  return (
    <Section ariaLabelledby="tk-why" className="pt-0 md:pt-0 lg:pt-0">
      <Heading id="tk-why" className="text-center">
        {why.title}
      </Heading>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-[20px] border border-line bg-bg p-8 md:p-10">
          <h3 className="text-heading-s text-ink-2">{why.bad.title}</h3>
          <ul className="mt-6 space-y-4">
            {why.bad.items.map((t) => (
              <li key={t} className="flex items-center gap-3 text-lg text-ink-3 line-through decoration-ink-3/50">
                <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-3">
                  <X className="size-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="relative overflow-hidden rounded-[20px] border border-line bg-surface p-8 md:p-10">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#018082,#00C6C9,#3DF5B0)]" />
          <h3 className="text-heading-s text-ink">{why.good.title}</h3>
          <ul className="mt-6 space-y-4">
            {why.good.items.map((t) => (
              <li key={t} className="flex items-center gap-3 text-lg text-ink">
                <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full border border-mint/30 text-mint">
                  <Check className="size-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal>
        <p className="text-display-s mx-auto mt-16 max-w-[820px] text-balance text-center text-ink md:mt-24">{why.closing}</p>
      </Reveal>
    </Section>
  );
}
