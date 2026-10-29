"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, ChartNoAxesCombined, Gamepad2, Wallet, type LucideIcon } from "lucide-react";
import { agents, type AgentId } from "@/data/content/ecosystem";
import { Card } from "@/components/ui/Card";
import { EASE, revealItem } from "@/components/ui/Reveal";

const ICONS: Record<AgentId, LucideIcon> = {
  executive: BrainCircuit,
  gaming: Gamepad2,
  reporting: ChartNoAxesCombined,
  wallet: Wallet,
};

const ACCENT: Record<AgentId, string> = {
  executive: "text-gold-2 border-gold/40 bg-gold/10 shadow-[0_0_32px_rgba(245,197,66,0.35)]",
  gaming: "text-[#C9A5FF] border-violet/40 bg-violet/10 shadow-[0_0_32px_rgba(153,69,255,0.35)]",
  reporting: "text-cyan border-cyan/30 bg-cyan/10 shadow-[0_0_32px_rgba(25,251,155,0.25)]",
  wallet: "text-mint border-mint/30 bg-mint/10 shadow-[0_0_32px_rgba(20,241,149,0.3)]",
};

/** 4 numbered agent cards joined by a glowing connector that draws in on view. */
export function AgentRoleCards() {
  const reduce = useReducedMotion();

  return (
    <div className="relative" role="group" aria-label={agents.diagramLabel}>
      {/* Connector: horizontal on desktop (through node centres), vertical on mobile */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[12.5%] top-[52px] hidden h-px lg:block">
        <div className="absolute inset-0 bg-line" />
        <motion.div
          className="absolute inset-0 origin-left bg-[linear-gradient(90deg,#F5C542,#9945FF,#19FB9B,#14F195)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE, delay: 0.2 }}
        />
        {!reduce && (
          <motion.div
            className="absolute -top-[3px] h-[7px] w-24 rounded-full bg-[radial-gradient(closest-side,#fff,rgba(255,224,138,0.6),transparent)] blur-[1px]"
            initial={{ left: "0%", opacity: 0 }}
            whileInView={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 3.2, ease: "easeInOut", delay: 1.2, repeat: 2, repeatDelay: 1 }}
          />
        )}
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-8 left-[48px] top-8 w-px bg-gradient-to-b from-gold/50 via-violet/50 to-mint/50 sm:hidden" />

      <motion.ol
        className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      >
        {agents.cards.map((a, i) => {
          const Icon = ICONS[a.id];
          return (
            <motion.li key={a.id} variants={revealItem} className="h-full">
              <Card className="flex h-full flex-col bg-surface/80 p-6 backdrop-blur-sm lg:p-7">
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className={`relative grid size-12 place-items-center rounded-full border ${ACCENT[a.id]}`}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span aria-hidden className="font-mono text-[13px] font-medium tracking-[0.08em] text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-heading-s mt-8 text-ink">{a.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{a.body}</p>
              </Card>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
