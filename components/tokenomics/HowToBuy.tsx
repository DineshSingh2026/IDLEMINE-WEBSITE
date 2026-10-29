import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Stepper, type Step } from "@/components/ui/Stepper";
import { buy } from "@/data/content/tokenomics";

export function HowToBuy() {
  const steps: Step[] = buy.steps.map((s) => ({
    title: s.title,
    body: s.body,
    extra:
      s.logos.length || ("cta" in s && s.cta) ? (
        <div className="flex flex-wrap items-center gap-3">
          {s.logos.map((l) => (
            <span
              key={l.name}
              className="inline-flex h-10 items-center gap-2.5 rounded-full border border-line bg-white/[0.03] pl-2 pr-4 text-sm font-medium text-ink"
            >
              <Image src={l.src} alt="" width={24} height={24} className="size-6 rounded-md object-contain" />
              {l.name}
            </span>
          ))}
          {"cta" in s && s.cta && (
            <Button href={s.cta.href} size="sm" variant={s.logos.length ? "primary" : "secondary"}>
              {s.cta.label}
            </Button>
          )}
        </div>
      ) : undefined,
  }));

  return (
    <Section id={buy.id} ariaLabelledby="tk-buy" blobs={[{ color: "violet", pos: { top: "30%", left: "0%" }, size: 600, opacity: 0.18 }]}>
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>{buy.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="tk-buy" className="mt-5" highlight={["$IDLE"]}>
            {buy.title}
          </Heading>
          <Reveal delay={0.1}>
            <p className="text-body-l mt-6">{buy.body}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <Callout>
              <p>
                <strong className="font-semibold text-ink">{buy.callout.strong}</strong> {buy.callout.text}{" "}
                <span className="break-all font-mono text-[13px] text-gold-2">{buy.callout.address}</span>.
              </p>
              <CopyAddress address={buy.callout.address} compact className="mt-4" />
            </Callout>
          </Reveal>
        </div>
        <Stepper steps={steps} />
      </div>
    </Section>
  );
}
