"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Word-mask stagger for the closing H2. The highlight phrase gets ONE continuous brand gradient
 * spread across its words (each word shows its own slice), so it reads like the hero's.
 * Reduced motion: MotionConfig reducedMotion="user" skips the transforms.
 */
export function CtaHeading({ id, text, highlight, className }: { id: string; text: string; highlight: string; className?: string }) {
  const at = text.indexOf(highlight);
  const leadWords = (at >= 0 ? text.slice(0, at) : text).trim().split(/\s+/).filter(Boolean);
  const hiWords = at >= 0 ? highlight.split(/\s+/) : [];
  const tailWords = (at >= 0 ? text.slice(at + highlight.length) : "").trim().split(/\s+/).filter(Boolean);
  const words = [
    ...leadWords.map((w) => ({ w, hi: -1 })),
    ...hiWords.map((w, k) => ({ w, hi: k })),
    ...tailWords.map((w) => ({ w, hi: -1 })),
  ];
  const n = hiWords.length;

  return (
    <h2 id={id} className={cn("text-balance text-ink", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
      >
        {words.map(({ w, hi }, i) => (
          <Fragment key={i}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className="inline-block"
              style={
                hi >= 0
                  ? {
                      backgroundImage: "linear-gradient(90deg,#00C6C9 0%,#3DF5B0 100%)",
                      backgroundSize: `${n * 100}% 100%`,
                      backgroundPosition: n > 1 ? `${(hi / (n - 1)) * 100}% 0` : "0 0",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : undefined
              }
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </h2>
  );
}
