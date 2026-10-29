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

/** Pointer spotlight: writes CSS vars only (no React state) so hover stays on the compositor. */
function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Accordion: one item open at a time, spring height, sliding accent bar, WAI-ARIA accordion pattern + arrow-key nav. */
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
        className="flex flex-col gap-3"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {items.map((item, i) => {
          const isOpen = open === i;
          const btnId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <motion.div
              key={item.q}
              variants={row}
              onPointerMove={onPointerMove}
              className={cn(
                "group/row relative rounded-[16px] border bg-surface transition-colors duration-[250ms] ease-out has-[button:focus-visible]:border-teal-400/80",
                isOpen ? "border-line-strong/60" : "border-line hover:border-line-strong/50",
              )}
            >
              {/* Decorative layers, clipped to the row (the accent bar is NOT clipped so it can travel between rows). */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                {/* open tint */}
                <div
                  className={cn(
                    "absolute inset-0 bg-[linear-gradient(100deg,rgba(0,198,201,0.07)_0%,rgba(0,198,201,0.015)_38%,transparent_62%)] transition-opacity duration-500 ease-out",
                    isOpen ? "opacity-100" : "opacity-0",
                  )}
                />
                {/* cursor spotlight (fine pointers only) */}
                <div
                  className="absolute left-0 top-0 size-[420px] rounded-full opacity-0 transition-opacity duration-300 ease-out will-change-transform [@media(hover:hover)]:group-hover/row:opacity-100"
                  style={{
                    transform: "translate3d(calc(var(--mx, -999px) - 210px), calc(var(--my, -999px) - 210px), 0)",
                    background: "radial-gradient(circle, rgba(0,198,201,0.10) 0%, rgba(0,198,201,0.035) 35%, transparent 65%)",
                  }}
                />
              </div>

              {/* Sliding accent bar — one shared layoutId, so it glides to whichever row is open. */}
              {isOpen && (
                <motion.span
                  aria-hidden
                  layoutId="faq-accent"
                  transition={BAR_SPRING}
                  className="absolute -left-px top-[22px] h-7 w-[3px] rounded-r-full bg-[linear-gradient(180deg,#00C6C9_0%,#3DF5B0_100%)] md:top-[26px]"
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
                  className="group/q flex w-full items-center justify-between gap-5 rounded-[16px] px-5 py-5 text-left outline-none md:gap-6 md:px-7 md:py-6"
                >
                  <span className="flex min-w-0 items-baseline gap-3 md:gap-4">
                    <span
                      aria-hidden
                      className={cn(
                        "shrink-0 font-mono text-[12px] leading-6 tabular-nums transition-colors duration-300",
                        isOpen ? "text-teal-400" : "text-ink-3 group-hover/q:text-ink-2",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[17px] leading-6 font-semibold tracking-[-0.01em] transition-colors duration-200 md:text-lg",
                        isOpen ? "text-ink" : "text-ink/90 group-hover/q:text-ink",
                      )}
                    >
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,color,background-color,transform] duration-300 ease-out",
                      isOpen
                        ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                        : "border-line text-ink-2 group-hover/q:scale-105 group-hover/q:border-line-strong group-hover/q:text-ink",
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
                      className="pr-5 pb-6 pl-[46px] md:pr-7 md:pb-7 md:pl-[58px]"
                    >
                      {item.contract ? <ContractAnswer /> : (
                        <p className="max-w-[62ch] text-[16px] leading-[26px] text-ink-2">{item.a}</p>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
      <div className="flex items-center justify-between gap-3 rounded-[8px] border border-line bg-surface-2 py-2 pr-2 pl-4">
        <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.08em] text-ink-3 uppercase max-sm:hidden">
          Solana
        </span>
        <CopyAddress className="min-w-0 justify-end sm:ml-auto" />
      </div>
      <p className="flex items-center gap-2 text-[13px] leading-5 text-warning">
        <ShieldAlert aria-hidden className="size-4 shrink-0" />
        Always check the contract address before you swap.
      </p>
    </div>
  );
}
