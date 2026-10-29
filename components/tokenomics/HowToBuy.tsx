import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { buy } from "@/data/content/tokenomics";

export function HowToBuy() {
  return (
    <Section id={buy.id} ariaLabelledby="tk-buy" className="pt-0 md:pt-0 lg:pt-0">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <Reveal>
            <Eyebrow>{buy.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="tk-buy" className="mt-5">
            {buy.title}
          </Heading>
          <Reveal delay={0.1}>
            <p className="text-body-l mt-6">{buy.body}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <div role="note" className="flex gap-4 rounded-[20px] border border-line bg-surface p-5 text-[15px] leading-relaxed text-ink-2 md:p-6">
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-warning/30 text-warning">
                <ShieldAlert className="size-[18px]" />
              </span>
              <div className="min-w-0">
                <p>
                  <strong className="font-semibold text-ink">{buy.callout.strong}</strong> {buy.callout.text}{" "}
                  <span className="break-all font-mono text-[13px] text-ink">{buy.callout.address}</span>.
                </p>
                <CopyAddress address={buy.callout.address} compact className="mt-4" />
              </div>
            </div>
          </Reveal>
        </div>

        <RevealGroup as="ol" className="lg:col-span-6 lg:col-start-7">
          {buy.steps.map((s, i) => {
            const last = i === buy.steps.length - 1;
            const cta = "cta" in s ? s.cta : undefined;
            return (
              <RevealItem as="li" key={s.title} className="relative grid grid-cols-[40px_1fr] gap-5 pb-10 last:pb-0 md:gap-8">
                {!last && <span aria-hidden className="absolute bottom-0 left-5 top-12 w-px bg-line" />}
                <span
                  aria-hidden
                  className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-sm font-medium text-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 pt-1.5">
                  <h3 className="text-heading-s text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="text-body mt-2">{s.body}</p>
                  {(s.logos.length > 0 || cta) && (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {s.logos.map((l) => (
                        <span
                          key={l.name}
                          className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line bg-surface pl-2 pr-4 text-sm font-medium text-ink"
                        >
                          <Image src={l.src} alt="" width={24} height={24} className="size-6 rounded-md object-contain" />
                          {l.name}
                        </span>
                      ))}
                      {cta && (
                        <Button href={cta.href} size="sm" variant={s.logos.length ? "primary" : "secondary"}>
                          {cta.label}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}
