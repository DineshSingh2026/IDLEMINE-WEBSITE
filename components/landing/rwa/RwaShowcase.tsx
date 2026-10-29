"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { AssetTile } from "./AssetTile";
import { PairingHub, type HubAsset } from "./PairingHub";

const tileIn = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

/**
 * Hub floating freely on the canvas, then the asset row (no outlines: spacing, light and one fading
 * hairline). Hovering an asset in either place highlights the same pair in both.
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
    <div className="relative mt-4 lg:mt-2">
      {/* borderless teal + violet light behind the hub, fully transparent well before any edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-10%] bottom-[20%] -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(0,198,201,0.16),rgba(0,198,201,0.04)_55%,transparent_75%),radial-gradient(ellipse_30%_30%_at_72%_62%,rgba(155,123,255,0.10),transparent_70%),radial-gradient(ellipse_28%_30%_at_28%_34%,rgba(61,245,176,0.07),transparent_70%)]" />

      <PairingHub assets={assets} pairSuffix={pairSuffix} active={active} onActive={setActive} />

      {/* fading hairline: teal at the centre, gone at both ends */}
      <div aria-hidden className="mx-auto mt-6 h-px w-full max-w-[960px] bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.45)_30%,rgba(61,245,176,0.4)_50%,rgba(155,123,255,0.35)_70%,transparent)] md:mt-8" />

      <motion.ul
        aria-label="Tokenized assets paired with $IDLE"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        className="mt-8 flex flex-wrap justify-center gap-y-8 md:mt-10 lg:flex-nowrap lg:justify-between"
      >
        {assets.map((a) => (
          <li key={a.ticker} className="w-1/4 lg:w-auto lg:flex-1">
            <motion.div variants={tileIn} className="h-full">
              <AssetTile asset={a} pairSuffix={pairSuffix} active={active === a.ticker} onActive={setActive} />
            </motion.div>
          </li>
        ))}
      </motion.ul>

      {/* On desktop the CTA sits beside the heading; below desktop it closes the row. */}
      <div className="mt-10 flex justify-center lg:hidden">
        <Button href={cta.href} variant="secondary" icon="external" ariaLabel={ctaAria}>
          {cta.label}
        </Button>
      </div>
    </div>
  );
}
