"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CircleDollarSign, Flame, Gem, Landmark, Repeat, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
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
        scrollTrigger: { trigger: el, start: "top top", end: "+=1600", pin: true, scrub: 0.8, anticipatePin: 1 },
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
    <section id={flywheel.id} aria-labelledby="tk-flywheel" className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <BackgroundBlobs blobs={[{ color: "gold", pos: { top: "60%", left: "50%" }, size: 900, opacity: 0.14 }]} />
      </div>
      <Container className="pt-24 md:pt-32 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Heading id="tk-flywheel">{flywheel.title}</Heading>
            <Reveal delay={0.1}>
              <p className="text-body-l mt-6 font-display text-gold-2">{flywheel.lead}</p>
            </Reveal>
          </div>
          <div className="space-y-6">
            <Reveal className="rounded-lg border border-line bg-surface/70 p-7 md:p-8">
              <h3 className="text-heading-s text-ink">{flywheel.cycle.title}</h3>
              <p className="text-body mt-3">{flywheel.cycle.p1}</p>
              <p className="text-body mt-3">
                {flywheel.cycle.p2} <strong className="font-semibold text-ink">{flywheel.cycle.p2Strong}</strong>
              </p>
            </Reveal>
            <Reveal delay={0.08} className="rounded-lg border border-gold/25 bg-gold/[0.04] p-7 md:p-8">
              <h3 className="text-heading-s text-ink">{flywheel.purchased.title}</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-3 text-ink">
                  <Flame aria-hidden className="size-5 shrink-0 text-gold" />
                  {flywheel.purchased.options[0]}
                  <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[11px] text-ink-3">
                    {flywheel.purchased.or}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-ink">
                  <Gem aria-hidden className="size-5 shrink-0 text-gold" />
                  {flywheel.purchased.options[1]}
                </li>
              </ul>
              <p className="text-body mt-4">{flywheel.purchased.result}</p>
            </Reveal>
          </div>
        </div>
      </Container>

      <div ref={pinRef} className="flex items-center py-20 lg:h-screen lg:py-0">
        <Container>
          <ol className="relative grid gap-4 lg:grid-cols-6 lg:gap-3" aria-label={flywheel.title}>
            <span aria-hidden className="absolute left-[8.33%] right-[8.33%] top-9 hidden h-px bg-line-strong lg:block" />
            <span
              aria-hidden
              data-beam
              className="absolute left-[8.33%] right-[8.33%] top-[35px] hidden h-[3px] origin-left rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-2 shadow-[0_0_20px_rgba(245,197,66,0.8)] lg:block"
            />
            {flywheel.stages.map((s, i) => {
              const Icon = ICONS[s.key];
              return (
                <li key={s.key} data-stage className="relative flex items-center gap-4 lg:flex-col lg:text-center">
                  <span className="relative flex size-[72px] shrink-0 items-center justify-center rounded-full border border-gold/40 bg-[#0B0A24] text-gold">
                    <span
                      data-lit
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-gold/15 shadow-[0_0_50px_rgba(245,197,66,0.55)] ring-1 ring-gold-2"
                    />
                    <Icon aria-hidden className="relative size-7" strokeWidth={1.6} />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-1 font-mono text-[13px] font-semibold tracking-[0.08em] text-ink">{s.label}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </div>
    </section>
  );
}
