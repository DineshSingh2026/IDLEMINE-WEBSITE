"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Variants } from "framer-motion";
import { Plus, ShieldAlert } from "lucide-react";
import type { Faq } from "@/data/content/landing";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Critically-damped spring: smooth, no overshoot (height must never bounce below 0). */
const HEIGHT_SPRING = { type: "spring", stiffness: 240, damping: 31, mass: 1 } as const;
const BAR_SPRING = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } as const;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Hairline that fades out at both ends (never a closed rectangle). */
function Hairline({ lit = false, className }: { lit?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-x-0 h-px", className)}>
      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.22)_18%,rgba(77,217,219,0.16)_60%,rgba(155,123,255,0.18)_85%,transparent)]" />
      <span
        className={cn(
          "absolute inset-0 bg-[linear-gradient(90deg,transparent,#00C6C9_15%,rgba(61,245,176,0.85)_45%,rgba(155,123,255,0.6)_80%,transparent)] shadow-[0_0_14px_rgba(0,198,201,0.55)] transition-opacity duration-500 ease-out",
          lit ? "opacity-100" : "opacity-0",
        )}
      />
    </span>
  );
}

/**
 * Open accordion with no containers: questions separated by fading gradient hairlines; the open item
 * is marked by a sliding teal accent line, a lit hairline, colour and soft edgeless light.
 * WAI-ARIA accordion pattern, one item open at a time, arrow/Home/End key navigation.
 */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  // Gate on mount: the server can't know the preference, and a differing first render breaks hydration.
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && prefersReduced;
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = items.length - 1;
    const target =
      e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <LayoutGroup id={baseId}>
      <motion.div
        className="relative flex flex-col"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <Hairline className="top-0" />
        {items.map((item, i) => {
          const isOpen = open === i;
          const btnId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <motion.div key={item.q} variants={row} data-open={isOpen || undefined} className="group/row relative">
              {/* edgeless teal light behind the open item (fully transparent before any edge) */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -inset-x-3 -inset-y-6 -z-10 md:-inset-x-8 bg-[radial-gradient(closest-side,rgba(0,198,201,0.13),rgba(0,198,201,0.045)_55%,transparent)] transition-opacity duration-500 ease-out",
                  isOpen ? "opacity-100" : "opacity-0",
                )}
              />

              {/* Sliding accent line: one shared layoutId, so it glides to whichever item is open. */}
              {isOpen && (
                <motion.span
                  aria-hidden
                  layoutId="faq-accent"
                  transition={BAR_SPRING}
                  className="absolute left-0 top-6 h-[calc(100%-48px)] min-h-7 w-[2px] rounded-full bg-[linear-gradient(180deg,#00C6C9_0%,#3DF5B0_55%,rgba(61,245,176,0)_100%)] shadow-[0_0_12px_rgba(0,198,201,0.7)] md:top-7 md:h-[calc(100%-56px)]"
                />
              )}

              <h3 className="relative">
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group/q flex w-full items-center justify-between gap-5 rounded-lg py-6 pr-1 pl-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:gap-6 md:py-7 md:pl-7"
                >
                  <span className="flex min-w-0 items-baseline gap-3 md:gap-4">
                    <span
                      aria-hidden
                      className={cn(
                        "shrink-0 font-mono text-[12px] leading-6 tabular-nums transition-colors duration-300",
                        isOpen ? "text-mint" : "text-teal-400/75 group-hover/q:text-teal-300",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[17px] leading-6 font-semibold tracking-[-0.01em] transition-colors duration-200 md:text-lg",
                        isOpen ? "text-teal-100" : "text-ink/90 group-hover/q:text-ink",
                      )}
                    >
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-[color,background-color,transform,box-shadow] duration-300 ease-out",
                      isOpen
                        ? "bg-[linear-gradient(135deg,rgba(0,198,201,0.35),rgba(61,245,176,0.2))] text-teal-100 shadow-[0_0_18px_rgba(0,198,201,0.45)]"
                        : "text-teal-300 group-hover/q:scale-105 group-hover/q:bg-teal-400/10 group-hover/q:text-teal-100",
                    )}
                  >
                    <Plus
                      className={cn(
                        "size-4 transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isOpen && "rotate-[135deg]",
                      )}
                    />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{
                      height: HEIGHT_SPRING,
                      opacity: { duration: 0.25, ease: "easeOut" },
                    }}
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -8 }}
                      animate={{ y: 0 }}
                      exit={{ y: -6 }}
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                      className="pr-5 pb-7 pl-[46px] md:pr-12 md:pb-8 md:pl-[66px]"
                    >
                      {item.contract ? <ContractAnswer /> : (
                        <p className="max-w-[62ch] text-[16px] leading-[26px] text-[#B4CCCF]">{item.a}</p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Hairline lit={isOpen} className="bottom-0" />
            </motion.div>
          );
        })}
      </motion.div>
    </LayoutGroup>
  );
}

function ContractAnswer() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.08em] text-teal-300 uppercase">Solana</span>
        <CopyAddress className="min-w-0" />
      </div>
      <p className="flex items-center gap-2 text-[13px] leading-5 text-warning">
        <ShieldAlert aria-hidden className="size-4 shrink-0" />
        Always check the contract address before you swap.
      </p>
    </div>
  );
}
