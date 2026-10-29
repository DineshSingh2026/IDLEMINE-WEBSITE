import Image from "next/image";
import { ArrowLeftRight, Blocks, Bot, Ticket, Trophy, type LucideIcon } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { hero, logos, utility, type UtilityKey } from "@/data/content/tokenomics";
import { cn } from "@/lib/utils";

const ICONS: Record<UtilityKey, LucideIcon> = {
  entries: Ticket,
  rewards: Trophy,
  agents: Bot,
  swaps: ArrowLeftRight,
  future: Blocks,
};

const LAYOUT: Record<UtilityKey, string> = {
  entries: "lg:col-span-4",
  rewards: "lg:col-span-2",
  agents: "lg:col-span-2",
  swaps: "lg:col-span-2",
  future: "lg:col-span-2",
};

/** Icon tint: teal by default; violet only for the agentic card, mint only for human rewards. */
const TINT: Record<UtilityKey, string> = {
  entries: "text-teal-400",
  rewards: "text-mint",
  agents: "text-violet",
  swaps: "text-teal-400",
  future: "text-teal-400",
};

function TokenChip({ src, label }: { src: string; label: string }) {
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface-2 pl-1 pr-3 font-mono text-[13px] font-medium text-ink-2">
      <Image src={src} alt="" width={24} height={24} className="size-6 rounded-full object-contain" />
      {label}
    </span>
  );
}

export function UtilityGrid() {
  return (
    <Section ariaLabelledby="tk-utility">
      <div className="max-w-[760px]">
        <Reveal>
          <Eyebrow>{utility.eyebrow}</Eyebrow>
        </Reveal>
        <Heading id="tk-utility" className="mt-5">
          {utility.title}
        </Heading>
      </div>

      <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {utility.cards.map((c, i) => {
          const Icon = ICONS[c.key];
          const big = c.key === "entries";
          return (
            <RevealItem as="li" key={c.key} className={cn("flex", LAYOUT[c.key], i === 0 && "sm:col-span-2")}>
              <Card interactive={false} className={cn("flex w-full flex-col p-6 md:p-8", big && "md:p-10")}>
                <span
                  aria-hidden
                  className={cn("flex size-11 items-center justify-center rounded-[12px] border border-line bg-surface-2", TINT[c.key])}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div className={cn("mt-auto pt-10", big && "max-w-[480px] pt-16")}>
                  {c.key === "swaps" && (
                    <div className="mb-5 flex flex-wrap items-center gap-2" aria-hidden>
                      <TokenChip src={hero.mark.src} label="IDLE" />
                      <ArrowLeftRight className="size-4 text-ink-3" />
                      <TokenChip src={logos.usdc} label="USDC" />
                      <TokenChip src={logos.solana} label="SOL" />
                    </div>
                  )}
                  <h3 className={cn("text-ink", big ? "text-heading-m" : "text-heading-s")}>{c.title}</h3>
                  <p className={cn("mt-3", big ? "text-body-l" : "text-body")}>{c.body}</p>
                </div>
              </Card>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
