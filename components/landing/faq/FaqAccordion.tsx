"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, ShieldAlert } from "lucide-react";
import type { Faq } from "@/data/content/landing";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Accordion: one item open at a time, animated height, WAI-ARIA accordion pattern + arrow-key nav. */
export function FaqAccordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();
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
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div
            key={item.q}
            className={cn(
              "rounded-[16px] border bg-surface transition-colors duration-[250ms] ease-out has-[button:focus-visible]:border-teal-400/80",
              isOpen ? "border-line-strong/60" : "border-line hover:border-line-strong/50",
            )}
          >
            <h3>
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
                className="group/q flex w-full items-center justify-between gap-6 rounded-[16px] px-5 py-5 text-left outline-none md:px-7 md:py-6"
              >
                <span
                  className={cn(
                    "font-display text-[17px] leading-6 font-semibold tracking-[-0.01em] transition-colors duration-200 md:text-lg",
                    isOpen ? "text-ink" : "text-ink/90 group-hover/q:text-ink",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border transition-[border-color,color,background-color] duration-[250ms] ease-out",
                    isOpen
                      ? "border-teal-400/40 bg-teal-400/10 text-teal-400"
                      : "border-line text-ink-2 group-hover/q:border-line-strong group-hover/q:text-ink",
                  )}
                >
                  <Plus
                    className={cn(
                      "size-4 transition-transform duration-[250ms] ease-out",
                      isOpen && "rotate-45",
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
                    height: { duration: 0.28, ease: EASE_OUT },
                    opacity: { duration: 0.2, ease: "easeOut" },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 md:px-7 md:pb-7">
                    {item.contract ? <ContractAnswer /> : (
                      <p className="max-w-[62ch] text-[16px] leading-[26px] text-ink-2">{item.a}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
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
