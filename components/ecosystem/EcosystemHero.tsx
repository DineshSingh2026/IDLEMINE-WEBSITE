"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ecosystemHero as hero } from "@/data/content/ecosystem";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EASE } from "@/components/ui/Reveal";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Grain } from "@/components/layout/Grain";
import { DotGrid } from "@/components/layout/DotGrid";
import { Container } from "@/components/layout/Container";

const sideMask =
  "linear-gradient(to bottom, transparent 0%, #000 18%, #000 70%, transparent 100%)";

export function EcosystemHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ySideL = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const ySideR = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yCoin = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scaleCoin = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fadeText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const p = (style: Record<string, unknown>) => (reduce ? undefined : style);

  return (
    <section
      ref={ref}
      aria-labelledby="eco-hero-title"
      className="relative isolate overflow-hidden pb-10 pt-16 md:pt-24 lg:pb-16"
    >
      {/* ── Background system ── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#151335_0%,#0b0b1c_45%,var(--bg)_80%)]" />
        <BackgroundBlobs
          blobs={[
            { color: "violet", pos: { top: "62%", left: "50%" }, size: 900, opacity: 0.4 },
            { color: "teal", pos: { top: "18%", left: "18%" }, size: 520, opacity: 0.22 },
            { color: "gold", pos: { top: "30%", left: "84%" }, size: 460, opacity: 0.12 },
          ]}
        />
        <DotGrid className="opacity-30" />
        <Grain />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
      </div>

      {/* ── Side art, pinned to the viewport edges ── */}
      <motion.div
        aria-hidden
        style={p({ y: ySideL })}
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[24vw] max-w-[300px] opacity-50 md:opacity-90"
      >
        <div
          className="relative h-full w-full"
          style={{
            maskImage: `${sideMask}, linear-gradient(to right, #000 35%, transparent)`,
            WebkitMaskImage: `${sideMask}, linear-gradient(to right, #000 35%, transparent)`,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Image src={hero.art.left.src} alt="" fill sizes="300px" className="object-cover object-left" priority />
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        style={p({ y: ySideR })}
        className="pointer-events-none absolute right-0 top-[8%] -z-10 h-[92%] w-[22vw] max-w-[280px] opacity-50 md:opacity-90"
      >
        <div
          className="relative h-full w-full"
          style={{
            maskImage: `${sideMask}, linear-gradient(to left, #000 35%, transparent)`,
            WebkitMaskImage: `${sideMask}, linear-gradient(to left, #000 35%, transparent)`,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Image src={hero.art.right.src} alt="" fill sizes="280px" className="object-cover object-right" priority />
        </div>
      </motion.div>

      {/* ── Copy (server-rendered, visible pre-JS) ── */}
      <Container className="relative">
        <motion.div style={p({ y: yText, opacity: fadeText })} className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <Eyebrow className="text-gold-2/80">{hero.eyebrow}</Eyebrow>
          <Heading as="h1" size="xl" id="eco-hero-title" immediate highlight={[...hero.highlight]} className="text-display-xl mt-6">
            {hero.title}
          </Heading>
          <p className="text-body-l mt-7 max-w-[640px] text-pretty">
            {hero.sub.map((line, i) => (
              <span key={i} className="md:block">
                {line}
                {i < hero.sub.length - 1 ? " " : null}
              </span>
            ))}
          </p>
        </motion.div>
      </Container>

      {/* ── Centre stage: the coin art, melting into the canvas ── */}
      <div className="relative mx-auto mt-6 w-full max-w-[1100px] px-2 md:-mt-2">
        <motion.div style={p({ y: yCoin, scale: scaleCoin })} className="relative">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
          >
            <div className="float-y relative">
              <div
                className="relative aspect-[842/414] w-full"
                style={{
                  maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 52%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 52%, transparent 100%)",
                }}
              >
                <Image
                  src={hero.art.coin.src}
                  alt={hero.art.coin.alt}
                  fill
                  priority
                  sizes="(min-width: 1100px) 1100px, 100vw"
                  className="object-cover"
                />
              </div>
              {/* gold under-glow that ties the art to the page */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[20%] -z-10 aspect-square w-[42%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(25,251,155,0.18),rgba(153,69,255,0.18)_45%,transparent_70%)] blur-3xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
