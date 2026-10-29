"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Single reveal: opacity 0→1, y 24→0, once, at 25% visibility.
 * Hero text should NOT be wrapped (SSR-visible before JS) — use for below-the-fold content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: revealItem.hidden,
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
      }}
    >
      {children}
    </M>
  );
}

/** Stagger container: direct <RevealItem> children animate in sequence (60–90ms). */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
  amount?: number;
}) {
  const M = motion[as];
  return (
    <M
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const M = motion[as];
  return (
    <M className={className} variants={revealItem}>
      {children}
    </M>
  );
}
