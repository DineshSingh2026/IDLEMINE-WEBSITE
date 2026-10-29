"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { roadmap, type RoadmapStatus } from "@/data/content/site";
import { cn } from "@/lib/utils";
import { MilestoneCard } from "./MilestoneCard";

gsap.registerPlugin(ScrollTrigger);

const nodeCls: Record<RoadmapStatus, string> = {
  done: "border-mint/60 bg-bg",
  live: "border-teal-400 bg-bg ring-4 ring-teal-400/10",
  next: "border-line-strong bg-bg",
  future: "border-line-strong bg-bg",
};
const dotCls: Record<RoadmapStatus, string> = {
  done: "bg-mint",
  live: "bg-teal-400 pulse-dot",
  next: "bg-ink-3",
  future: "bg-ink-3",
};

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const MOBILE = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Roadmap rail. ≥1024px: section pins, the track translates horizontally (scrub 0.8) while a teal
 * progress line fills and each phase node lights as the line reaches it (solana.com event rail).
 * <1024px or reduced motion: vertical timeline, everything visible.
 */
export function Timeline() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const total = roadmap.length;
  const liveIndex = Math.max(
    0,
    roadmap.findIndex((m) => m.status === "live"),
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(section);

      mm.add(DESKTOP, () => {
        const t = track.current!;
        const r = rail.current!;
        const nodes = q<HTMLElement>("[data-node]");
        const cards = q<HTMLElement>("[data-card]");
        const center = (n: HTMLElement) => (n.parentElement as HTMLElement).offsetLeft + n.offsetLeft + n.offsetWidth / 2;
        const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);

        gsap.set(fill.current, { opacity: 1, scaleX: 0, scaleY: 1 });
        gsap.set(cards, { opacity: 0.32, y: 16 });
        gsap.set(nodes, { scale: 0.6, opacity: 0.5 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => "+=" + Math.max(window.innerHeight, dist() * 1.15),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The fill tip sweeps the viewport left→right; the active phase is the last node it passed.
              const railW = r.offsetWidth || 1;
              const tip = self.progress * railW;
              let idx = 0;
              nodes.forEach((n, i) => {
                if (center(n) <= tip - 24) idx = i;
              });
              setActive(idx);
            },
          },
        });

        tl.to(t, { x: () => -dist(), duration: 1 }, 0).to(fill.current, { scaleX: 1, duration: 1 }, 0);

        // Light each node + card when the fill tip reaches it.
        nodes.forEach((n, i) => {
          const at = Math.min(0.95, Math.max(0, center(n) / (r.offsetWidth || 1) - 0.02));
          tl.to(n, { scale: 1, opacity: 1, duration: 0.06, ease: "power2.out" }, at);
          tl.to(cards[i], { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, Math.max(0, at - 0.03));
        });
      });

      mm.add(MOBILE, () => {
        gsap.set(fill.current, { opacity: 1, scaleY: 0, scaleX: 1 });
        gsap.to(fill.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: rail.current, start: "top 70%", end: "bottom 60%", scrub: 0.8 },
        });
      });

      mm.add(REDUCED, () => {
        // Static: fill the rail up to the current (live) phase.
        const r = rail.current!;
        const node = q<HTMLElement>("[data-node]")[liveIndex];
        if (!node) return;
        const ratio = ((node.parentElement as HTMLElement).offsetTop + node.offsetTop + node.offsetHeight / 2) / (r.offsetHeight || 1);
        gsap.set(fill.current, { opacity: 1, scaleX: 1, scaleY: Math.min(1, ratio) });
      });
    }, section);

    return () => ctx.revert();
  }, [liveIndex]);

  const current = roadmap[active];

  return (
    <section
      ref={section}
      aria-labelledby="roadmap-phases"
      className="relative isolate overflow-hidden lg:motion-safe:h-[100svh]"
    >
      <h2 id="roadmap-phases" className="sr-only">
        Roadmap phases
      </h2>

      <div className="relative pb-16 pt-8 md:pb-24 md:pt-12 lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:pb-0 lg:motion-safe:pt-[72px]">
        {/* Desktop phase counter */}
        <div className="mx-auto mb-14 hidden w-full max-w-[1280px] items-end justify-between px-12 lg:motion-safe:flex">
          <div aria-hidden className="flex items-baseline gap-4 font-mono">
            <span className="text-5xl font-semibold tabular-nums tracking-tight text-ink">
              {String(current.phase).padStart(2, "0")}
            </span>
            <span className="text-lg text-ink-3">/ {String(total).padStart(2, "0")}</span>
            <span className="ml-4 text-sm uppercase tracking-[0.14em] text-ink-2">{current.name}</span>
          </div>
          <div aria-hidden className="flex items-center gap-2">
            {roadmap.map((m, i) => (
              <span
                key={m.phase}
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-300 ease-out",
                  i === active ? "w-10 bg-teal-400" : i < active ? "w-4 bg-teal-400/40" : "w-4 bg-line-strong/60",
                )}
              />
            ))}
          </div>
        </div>

        <div
          ref={track}
          className="mx-auto max-w-[1280px] px-6 will-change-transform lg:px-12 lg:motion-safe:mx-0 lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:pl-[calc(max(0px,(100vw_-_1280px)/2)_+_48px)] lg:motion-safe:pr-[calc(max(0px,(100vw_-_1280px)/2)_+_48px)]"
        >
          <div ref={rail} className="relative">
            {/* Base rail */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[11px] top-6 w-px bg-gradient-to-b from-line-strong/70 via-line-strong/70 to-transparent lg:motion-safe:bottom-auto lg:motion-safe:left-0 lg:motion-safe:-right-40 lg:motion-safe:top-[11px] lg:motion-safe:h-px lg:motion-safe:w-auto lg:motion-safe:bg-gradient-to-r"
            />
            {/* Teal progress fill */}
            <span
              ref={fill}
              aria-hidden
              className="absolute bottom-6 left-[10.5px] top-6 w-[2px] origin-top rounded-full bg-teal-400 opacity-0 lg:motion-safe:bottom-auto lg:motion-safe:left-0 lg:motion-safe:right-0 lg:motion-safe:top-[10.5px] lg:motion-safe:h-[2px] lg:motion-safe:w-auto lg:motion-safe:origin-left"
            />

            <ol className="relative flex flex-col gap-8 lg:motion-safe:flex-row lg:motion-safe:gap-8">
              {roadmap.map((m) => (
                <li
                  key={m.phase}
                  className="relative pl-12 lg:motion-safe:w-[440px] lg:motion-safe:shrink-0 lg:motion-safe:pl-0 lg:motion-safe:pt-16"
                >
                  <span
                    data-node
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-8 grid size-[23px] place-items-center rounded-full border-2 lg:motion-safe:left-8 lg:motion-safe:top-0",
                      nodeCls[m.status],
                    )}
                  >
                    <span className={cn("size-2 rounded-full", dotCls[m.status])} />
                  </span>
                  {/* Stem from node to card (desktop) */}
                  <span
                    aria-hidden
                    className="absolute left-[43px] top-[23px] hidden h-[41px] w-px bg-line-strong/60 lg:motion-safe:block"
                  />
                  <div data-card className="h-full">
                    <MilestoneCard m={m} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
