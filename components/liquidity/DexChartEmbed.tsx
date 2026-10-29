"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { LineChart } from "lucide-react";
import { DEX_EMBED } from "@/lib/token";
import { poolsSection } from "@/data/content/liquidity";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** DexScreener chart, mounted only after the visitor asks for it (keeps the page light). */
export function DexChartEmbed() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="dex-chart"
        className="inline-flex h-10 items-center gap-2 rounded-[12px] px-3 text-sm font-semibold text-ink-2 transition-colors duration-200 ease-out hover:bg-white/[0.04] hover:text-ink -ml-3"
      >
        <LineChart aria-hidden className="size-4 text-teal-400" />
        {open ? poolsSection.hideChart : poolsSection.showChart}
        <Image src="/assets/logos/dexscreener.svg" alt="" width={16} height={16} className="ml-1 size-4 opacity-60" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="dex-chart"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mt-4 overflow-hidden rounded-[12px] border border-line bg-surface-2">
              <iframe
                src={DEX_EMBED}
                title={poolsSection.chartTitle}
                loading="lazy"
                className="block h-[520px] w-full md:h-[600px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
