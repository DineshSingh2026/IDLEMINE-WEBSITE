"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE } from "./Reveal";

type Level = "h1" | "h2" | "h3";
type Size = "xl" | "l" | "s" | "m";

const sizeCls: Record<Size, string> = {
  xl: "text-display-xl",
  l: "text-display-l",
  s: "text-display-s",
  m: "text-heading-m",
};

/**
 * Word-level stagger reveal (y 110% → 0 inside overflow-hidden wrappers), like solana.com.
 * `highlight` words (exact match, e.g. "$IDLE") get the gold gradient.
 * `immediate` animates on mount instead of in-view (use for heroes). Text is always in the
 * SSR HTML; `ssrVisible` keeps hero text visible before JS for LCP.
 */
export function Heading({
  as: Tag = "h2",
  size = "l",
  children,
  className,
  highlight = [],
  id,
  immediate = false,
  delay = 0,
}: {
  as?: Level;
  size?: Size;
  children: string;
  className?: string;
  highlight?: string[];
  id?: string;
  immediate?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  const trigger = immediate
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.5 } };

  return (
    <Tag id={id} className={cn(sizeCls[size], "text-ink text-balance", className)}>
      <span className="sr-only">{children}</span>
      <motion.span
        aria-hidden
        className="block"
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className={cn("inline-block", highlight.includes(w) && "text-grad-brand")}
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "110%" },
                show: reduce
                  ? { opacity: 1, transition: { duration: 0.6 } }
                  : { y: "0%", transition: { duration: 0.9, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
