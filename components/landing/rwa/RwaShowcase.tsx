"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { EASE } from "@/components/ui/Reveal";
import { AssetTile } from "./AssetTile";
import { PairingHub, type HubAsset } from "./PairingHub";

const tileIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

/**
 * Hub + tile row in one panel. Hovering an asset in either place highlights the same pair in both.
 */
export function RwaShowcase({
  assets,
  pairSuffix,
  cta,
  ctaAria,
}: {
  assets: HubAsset[];
  pairSuffix: string;
  cta: { label: string; href: string };
  ctaAria: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mt-12 overflow-hidden rounded-[20px] border border-line bg-bg/60 lg:mt-16">
      <PairingHub assets={assets} pairSuffix={pairSuffix} active={active} onActive={setActive} />

      <motion.ul
        aria-label="Tokenized assets paired with $IDLE"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4 lg:grid-cols-7"
      >
        {assets.map((a) => (
          <li key={a.ticker} className="bg-bg">
            <motion.div variants={tileIn} className="h-full">
              <AssetTile asset={a} pairSuffix={pairSuffix} active={active === a.ticker} onActive={setActive} />
            </motion.div>
          </li>
        ))}
        {/* 8th cell completes the grid below desktop; on desktop the CTA sits in the header. */}
        <li className="bg-bg lg:hidden">
          <motion.a
            variants={tileIn}
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ctaAria}
            className="group/more flex h-full min-h-[172px] flex-col items-center justify-center gap-5 bg-bg/70 px-3 text-center transition-colors duration-[250ms] ease-out hover:bg-surface focus-visible:bg-surface"
          >
            <span className="flex size-14 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-[250ms] group-hover/more:border-teal-400 group-hover/more:text-teal-400 md:size-16">
              <ArrowUpRight aria-hidden className="size-5" />
            </span>
            <span className="text-sm font-semibold text-ink">{cta.label}</span>
          </motion.a>
        </li>
      </motion.ul>
    </div>
  );
}
