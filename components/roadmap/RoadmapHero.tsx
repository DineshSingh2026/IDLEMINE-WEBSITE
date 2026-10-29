"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { roadmapHero } from "@/data/content/roadmap";
import { roadmap, roadmapStatusLabel } from "@/data/content/site";
import { badgeFor } from "./MilestoneCard";

/** Roadmap hero: games art on a slow parallax layer under a dark gradient mask. */
export function RoadmapHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const current = roadmap.find((m) => m.status === "live");
  const first = roadmap[0];
  const last = roadmap[roadmap.length - 1];

  return (
    <section
      ref={ref}
      aria-labelledby="roadmap-title"
      className="relative isolate -mt-[72px] flex min-h-[560px] items-end overflow-hidden pb-8 pt-[calc(72px+96px)] md:min-h-[64svh] md:pb-12 md:pt-[calc(72px+120px)] lg:pb-[60px]"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale }}>
          <Image
            src={roadmapHero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_40%] opacity-40 grayscale"
          />
        </motion.div>
        {/* Dark gradient masks: left for legibility, bottom into the page canvas, top under the header */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#05080A_0%,rgba(5,8,10,0.92)_30%,rgba(5,8,10,0.55)_60%,rgba(5,8,10,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,10,0.85)_0%,rgba(5,8,10,0)_30%,rgba(5,8,10,0)_55%,#05080A_100%)]" />
      </div>

      <Container>
        <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="max-w-[820px]">
          <Eyebrow>{roadmapHero.eyebrow}</Eyebrow>
          <Heading as="h1" id="roadmap-title" size="xl" immediate highlight={roadmapHero.highlight} className="mt-6">
            {roadmapHero.title}
          </Heading>
          <p className="text-body-l mt-6 max-w-[560px]">{roadmapHero.sub}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
            {current && (
              <p className="flex items-center gap-3 text-sm text-ink-2">
                <Badge status={badgeFor[current.status]}>{roadmapStatusLabel[current.status]}</Badge>
                <span>
                  <span className="font-mono text-ink-3">Phase {current.phase}</span>
                  <span className="mx-2 text-ink-3">·</span>
                  <span className="text-ink">{current.name}</span>
                </span>
              </p>
            )}
            <p className="font-mono text-sm text-ink-3">
              Phase {first.phase}
              {first.date ? ` · ${first.date}` : ""} → Phase {last.phase}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
