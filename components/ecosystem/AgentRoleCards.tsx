"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ChartNoAxesCombined, Gamepad2, Wallet, type LucideIcon } from "lucide-react";
import { agents, type AgentId } from "@/data/content/ecosystem";
import { Card } from "@/components/ui/Card";
import { revealItem } from "@/components/ui/Reveal";

const ICONS: Record<AgentId, LucideIcon> = {
  executive: BrainCircuit,
  gaming: Gamepad2,
  reporting: ChartNoAxesCombined,
  wallet: Wallet,
};

/** 4 numbered agent cards on a hairline connector. Violet = agentic, used on the icons only. */
export function AgentRoleCards() {
  return (
    <div className="relative" role="group" aria-label={agents.diagramLabel}>
      {/* Connector: horizontal hairline through the icon centres (desktop), vertical on mobile */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[12.5%] top-[44px] hidden h-px bg-line-strong/60 lg:block" />
      <div aria-hidden className="pointer-events-none absolute bottom-8 left-[44px] top-8 w-px bg-line-strong/60 sm:hidden" />

      <motion.ol
        className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {agents.cards.map((a, i) => {
          const Icon = ICONS[a.id];
          return (
            <motion.li key={a.id} variants={revealItem} className="h-full">
              <Card interactive={false} className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className="relative grid size-10 place-items-center rounded-[12px] border border-line bg-surface-2 text-violet"
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
