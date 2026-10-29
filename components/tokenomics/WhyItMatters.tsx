import { Check, X } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { why } from "@/data/content/tokenomics";

export function WhyItMatters() {
  return (
    <Section ariaLabelledby="tk-why">
      <Heading id="tk-why" className="text-center">
        {why.title}
      </Heading>
      <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
        <Reveal className="rounded-lg border border-[#FF5C7A]/25 bg-[#FF5C7A]/[0.04] p-8 md:p-10">
          <h3 className="text-heading-s text-ink-2">{why.bad.title}</h3>
          <ul className="mt-6 space-y-4">
            {why.bad.items.map((t) => (
              <li key={t} className="flex items-center gap-3 text-lg text-ink-3 line-through decoration-[#FF5C7A]/40">
                <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-[#FF5C7A]/10 text-[#FF7A93]">
                  <X className="size-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="rounded-lg border border-gold/40 bg-gradient-to-br from-gold/[0.12] to-gold/[0.02] p-8 shadow-[0_0_80px_rgba(245,197,66,0.1)] md:p-10">
          <h3 className="text-heading-s text-gold-2">{why.good.title}</h3>
          <ul className="mt-6 space-y-4">
            {why.good.items.map((t) => (
              <li key={t} className="flex items-center gap-3 text-lg text-ink">
                <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-gold/15 text-gold">
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
