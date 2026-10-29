"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ecosystemHero as hero } from "@/data/content/ecosystem";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "@/components/layout/Container";

/**
 * Ecosystem hero: one statement, one supporting line, and the coin art presented in a calm,
 * hairline-framed panel on the bg-void canvas (no glows, no blobs, no parallax).
 */
export function EcosystemHero() {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="eco-hero-title" className="relative isolate pb-8 pt-16 md:pb-12 md:pt-24 lg:pb-[60px] lg:pt-[120px]">
      <Container className="relative">
        <div className="mx-auto flex max-w-[880px] flex-col items-center text-center">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Heading as="h1" size="xl" id="eco-hero-title" immediate highlight={[...hero.highlight]} className="mt-6">
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
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto mt-12 w-full max-w-[1080px] md:mt-16"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-line bg-surface sm:aspect-[842/414]">
            <Image
              src={hero.art.coin.src}
              alt={hero.art.coin.alt}
              fill
              priority
              sizes="(min-width: 1080px) 1080px, 100vw"
              className="object-cover saturate-[0.7]"
            />
            {/* Neutral wash: pulls the art's saturation toward the bg-void ground */}
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,10,0.15)_0%,rgba(5,8,10,0)_40%,rgba(5,8,10,0.55)_100%)]" />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
