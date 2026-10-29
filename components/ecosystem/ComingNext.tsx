import Image from "next/image";
import { comingNext } from "@/data/content/ecosystem";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";

/** Closing CTA band: gradient-bordered panel with the IdleMine mark orbit. */
export function ComingNext() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-xl p-px [background:linear-gradient(135deg,rgba(245,197,66,0.55),rgba(153,69,255,0.35)_45%,rgba(20,241,149,0.45))]">
        <div className="relative isolate overflow-hidden rounded-[31px] bg-[radial-gradient(110%_120%_at_100%_0%,#1b1440_0%,#0d0e18_55%,#0a0b12_100%)] px-6 py-16 sm:px-12 md:py-20 lg:px-20">
          <div aria-hidden className="absolute inset-0 -z-10 dot-grid opacity-40" />
          <div aria-hidden className="absolute -bottom-40 -left-20 -z-10 size-[420px] rounded-full bg-violet/25 blur-[120px]" />
          <div aria-hidden className="absolute -right-10 -top-24 -z-10 size-[360px] rounded-full bg-gold/15 blur-[120px]" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col items-start">
              <Eyebrow>{comingNext.eyebrow}</Eyebrow>
              <Heading size="l" className="text-display-l mt-5" id="coming-next-title">
                {comingNext.title}
              </Heading>
              <p className="text-body-l mt-6 max-w-[560px]">{comingNext.body}</p>
              <Button href={comingNext.cta.href} className="mt-10" icon="arrow">
                {comingNext.cta.label}
              </Button>
            </div>

            {/* Orbit: one token at the centre, rings for the platforms still to plug in */}
            <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[340px]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-dashed border-white/10"
                  style={{ inset: `${i * 15}%` }}
                />
              ))}
              <div className="absolute inset-[6%] animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
                <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_16px_#F5C542]" />
                <span className="absolute bottom-[14%] left-[6%] size-2 rounded-full bg-violet shadow-[0_0_14px_#9945FF]" />
              </div>
              <div className="absolute inset-[20%] animate-[spin_28s_linear_infinite_reverse] motion-reduce:animate-none">
                <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-mint shadow-[0_0_14px_#14F195]" />
              </div>
              <div className="absolute inset-[33%] rounded-full shadow-[0_0_80px_rgba(15,163,160,0.5)]">
                <Image src="/assets/img/idlemine-mark.png" alt="" fill sizes="120px" className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
