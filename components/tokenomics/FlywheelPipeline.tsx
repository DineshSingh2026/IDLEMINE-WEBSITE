"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleDollarSign, Flame, Gem, Landmark, Repeat, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { flywheel, type StageKey } from "@/data/content/tokenomics";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<StageKey, LucideIcon> = {
  revenue: CircleDollarSign,
  treasury: Landmark,
  buybacks: Repeat,
  burn: Flame,
  scarcity: Gem,
  economy: TrendingUp,
};

export function FlywheelPipeline() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pinRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stages = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-stage]"));
      const lits = el.querySelectorAll("[data-lit]");
      gsap.set(stages, { opacity: 0.32 });
      gsap.set(lits, { opacity: 0 });
      gsap.set(el.querySelector("[data-beam]"), { scaleX: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "center center", end: "+=1600", pin: true, scrub: 0.8, anticipatePin: 1 },
      });
      tl.to(el.querySelector("[data-beam]"), { scaleX: 1, duration: stages.length - 1 }, 0);
      stages.forEach((s, i) => {
        tl.to(s, { opacity: 1, duration: 0.3 }, Math.max(0, i - 0.15));
        tl.to(s.querySelector("[data-lit]"), { opacity: 1, duration: 0.3 }, Math.max(0, i - 0.15));
      });
      tl.to({}, { duration: 0.4 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id={flywheel.id} aria-labelledby="tk-flywheel" className="relative isolate pb-16 md:pb-24 lg:pb-[120px]">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Heading id="tk-flywheel">{flywheel.title}</Heading>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-body-l">{flywheel.lead}</p>
          </Reveal>
        </div>
      </Container>

      <div ref={pinRef} className="pt-12 lg:py-12">
        <Container>
          <div className="rounded-[20px] border border-line bg-surface px-6 py-8 md:px-10 lg:py-12">
            <ol className="relative grid gap-4 lg:grid-cols-6 lg:gap-3" aria-label={flywheel.title}>
              <span aria-hidden className="absolute left-[8.33%] right-[8.33%] top-8 hidden h-px bg-line-strong lg:block" />
              <span
                aria-hidden
                data-beam
                className="absolute left-[8.33%] right-[8.33%] top-[31.5px] hidden h-[2px] origin-left bg-teal-400 lg:block"
              />
              {flywheel.stages.map((s, i) => {
                const Icon = ICONS[s.key];
                return (
                  <li key={s.key} data-stage className="relative flex items-center gap-4 lg:flex-col lg:text-center">
                    <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-teal-400">
                      <span data-lit aria-hidden className="absolute -inset-px hidden rounded-full border lg:block border-teal-400 bg-[#013B3D]" />
                      <Icon aria-hidden className="relative size-6" strokeWidth={1.6} />
                    </span>
                    <div>
                      <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <p className="mt-1 font-mono text-[13px] font-medium tracking-[0.08em] text-ink">{s.label}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 grid gap-6 border-t border-line pt-10 md:grid-cols-2 lg:mt-12 lg:pt-12">
              <div>
                <h3 className="text-heading-s text-ink">{flywheel.cycle.title}</h3>
                <p className="text-body mt-3">{flywheel.cycle.p1}</p>
                <p className="text-body mt-3">
                  {flywheel.cycle.p2} <strong className="font-semibold text-ink">{flywheel.cycle.p2Strong}</strong>
                </p>
              </div>
              <div className="md:border-l md:border-line md:pl-10">
                <h3 className="text-heading-s text-ink">{flywheel.purchased.title}</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-ink">
                    <Flame aria-hidden className="mt-0.5 size-5 shrink-0 text-teal-400" />
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      {flywheel.purchased.options[0]}
                      <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[11px] text-ink-3">
                        {flywheel.purchased.or}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-ink">
                    <Gem aria-hidden className="size-5 shrink-0 text-teal-400" />
                    {flywheel.purchased.options[1]}
                  </li>
                </ul>
                <p className="text-body mt-4">{flywheel.purchased.result}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
