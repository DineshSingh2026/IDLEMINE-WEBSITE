"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./Reveal";

export type Step = { title: string; body: React.ReactNode; extra?: React.ReactNode };

/** Vertical numbered stepper — gold number circles joined by a line that draws in. */
export function Stepper({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          className="relative grid grid-cols-[48px_1fr] gap-5 pb-10 last:pb-0 md:grid-cols-[56px_1fr] md:gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
        >
          {i < steps.length - 1 && (
            <motion.span
              aria-hidden
              className="absolute left-6 top-14 bottom-2 w-px origin-top bg-gradient-to-b from-gold/60 to-line md:left-7 md:top-16"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.08 }}
            />
          )}
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-display text-lg font-bold text-gold shadow-[0_0_40px_rgba(0,198,201,0.2)] md:size-14 md:text-xl"
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-1.5 md:pt-2.5">
            <h3 className="text-heading-s text-ink">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <div className="mt-2 text-body">{s.body}</div>
            {s.extra && <div className="mt-5">{s.extra}</div>}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
