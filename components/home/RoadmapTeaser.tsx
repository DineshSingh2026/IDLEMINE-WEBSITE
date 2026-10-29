"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { roadmapTeaser } from "@/data/content/home";
import { roadmap, roadmapStatusLabel, type RoadmapStatus } from "@/data/content/site";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { GoldText } from "./GoldText";

const STATUS: Record<RoadmapStatus, { chip: string; dot?: string; bar: string }> = {
  done: { chip: "border-mint/30 bg-mint/10 text-mint", dot: "bg-mint", bar: "bg-mint" },
  live: { chip: "border-gold/40 bg-gold/10 text-gold-2", dot: "bg-gold pulse-dot", bar: "bg-gold" },
  next: { chip: "border-line-strong text-ink-3", bar: "bg-white/15" },
  future: { chip: "border-line-strong text-ink-3", bar: "bg-white/10" },
};

export function RoadmapTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section ref={ref} aria-labelledby="roadmap-title" className="relative isolate overflow-hidden py-24 md:py-32 lg:py-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundBlobs
          blobs={[
            { color: "violet", pos: { top: "60%", left: "70%" }, size: 700, opacity: 0.3 },
            { color: "gold", pos: { top: "30%", left: "15%" }, size: 480, opacity: 0.12 },
          ]}
        />
        {/* Parallax art layer — 30% opacity, masked into the right of the section */}
        <motion.div
          className="absolute inset-y-[-12%] right-[-10%] w-[95%] opacity-30 md:w-[75%] [mask-image:radial-gradient(ellipse_60%_55%_at_60%_50%,#000_25%,transparent_72%)]"
          style={reduce ? undefined : { y, scale }}
        >
          <Image src={roadmapTeaser.art} alt="" fill sizes="(min-width: 768px) 75vw, 95vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent" />
      </div>

      <Container>
        <RevealGroup className="max-w-[640px]">
          <RevealItem>
            <Eyebrow>{roadmapTeaser.eyebrow}</Eyebrow>
          </RevealItem>
          <Heading id="roadmap-title" className="text-display-l mt-5" highlight={["$IDLE"]}>
            {roadmapTeaser.title}
          </Heading>
          <RevealItem>
            <p className="text-body-l mt-6 max-w-[520px]">{roadmapTeaser.body}</p>
          </RevealItem>
          <RevealItem className="mt-10">
            <Button href={roadmapTeaser.cta.href}>{roadmapTeaser.cta.label}</Button>
          </RevealItem>
        </RevealGroup>

        <RevealGroup as="ol" className="mt-20 grid gap-3 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4" delay={0.15} stagger={0.08}>
          {roadmap.map((m) => {
            const s = STATUS[m.status];
            return (
              <RevealItem
                as="li"
                key={m.phase}
                className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c0e16]/70 p-6 backdrop-blur-xl"
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-px", s.bar)} />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
                    {roadmapTeaser.phaseLabel} {m.phase}
                  </span>
                  <span
                    className={cn(
                      "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
                      s.chip,
                    )}
                  >
                    {s.dot && <span aria-hidden className={cn("size-1.5 rounded-full", s.dot)} />}
                    {roadmapStatusLabel[m.status]}
                  </span>
                </div>
                <h3 className="text-heading-s mt-6 text-ink">{m.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  <GoldText text={m.copy} />
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}
