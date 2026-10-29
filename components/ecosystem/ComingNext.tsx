import Image from "next/image";
import { comingNext } from "@/data/content/ecosystem";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";

/** Closing CTA: a surface-1 card with a hairline orbit around the IdleMine mark. */
export function ComingNext() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface px-6 py-12 sm:px-12 md:py-16 lg:px-16">
        {/* Thin gradient-economies rule: both economies plug into the same token */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#00C6C9_30%,#9B7BFF_70%,transparent)] opacity-60" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col items-start">
            <Eyebrow>{comingNext.eyebrow}</Eyebrow>
            <Heading size="l" className="mt-5" id="coming-next-title">
              {comingNext.title}
            </Heading>
            <p className="text-body-l mt-6 max-w-[560px]">{comingNext.body}</p>
            <Button href={comingNext.cta.href} className="mt-10" icon="arrow">
              {comingNext.cta.label}
            </Button>
          </div>

          {/* Orbit: one token at the centre, rings for the platforms still to plug in */}
          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[300px]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute rounded-full border border-line" style={{ inset: `${i * 15}%` }} />
            ))}
            <div className="absolute inset-0 animate-[spin_90s_linear_infinite] motion-reduce:animate-none">
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400" />
            </div>
            <div className="absolute inset-[15%] animate-[spin_70s_linear_infinite_reverse] motion-reduce:animate-none">
              <span className="absolute bottom-[14.6%] left-[14.6%] size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet" />
            </div>
            <div className="absolute inset-[30%] animate-[spin_50s_linear_infinite] motion-reduce:animate-none">
              <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-mint" />
            </div>
            <div className="absolute inset-[38%]">
              <Image src="/assets/img/idlemine-mark.png" alt="" fill sizes="96px" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
