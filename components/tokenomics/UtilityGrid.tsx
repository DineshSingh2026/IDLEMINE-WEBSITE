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
  entries: "lg:col-span-4 lg:min-h-[300px]",
  rewards: "lg:col-span-2",
  agents: "lg:col-span-2",
  swaps: "lg:col-span-2",
  future: "lg:col-span-2",
};

const ACCENT: Record<UtilityKey, string> = {
  entries: "from-gold/25 text-gold",
  rewards: "from-gold/25 text-gold-2",
  agents: "from-violet/30 text-[#C9A5FF]",
  swaps: "from-mint/20 text-mint",
  future: "from-teal/30 text-[#5FE0DC]",
};

function TokenChip({ src, label }: { src: string; label: string }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white/[0.04] pl-1.5 pr-3 font-mono text-[13px] font-medium text-ink">
      <Image src={src} alt="" width={24} height={24} className="size-6 rounded-full object-contain" />
      {label}
    </span>
  );
}

export function UtilityGrid() {
  return (
    <Section
      ariaLabelledby="tk-utility"
      blobs={[{ color: "violet", pos: { top: "50%", left: "90%" }, size: 600, opacity: 0.18 }]}
    >
      <div className="max-w-[760px]">
        <Reveal>
          <Eyebrow>{utility.eyebrow}</Eyebrow>
        </Reveal>
        <Heading id="tk-utility" className="mt-5">
          {utility.title}
        </Heading>
      </div>

      <RevealGroup as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-6 lg:gap-5">
        {utility.cards.map((c, i) => {
          const Icon = ICONS[c.key];
          const big = c.key === "entries";
          return (
            <RevealItem as="li" key={c.key} className={cn("flex", LAYOUT[c.key], i === 0 && "sm:col-span-2")}>
              <Card className={cn("flex w-full flex-col bg-surface/80", big && "md:p-10")}>
                <Icon
                  aria-hidden
                  strokeWidth={1}
                  className={cn(
                    "pointer-events-none absolute -right-6 -top-6 text-white/[0.035] transition-transform duration-700 ease-quint group-hover:-rotate-6 group-hover:scale-105",
                    big ? "size-64" : "size-40",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "relative flex size-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br to-transparent",
                    ACCENT[c.key],
                  )}
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <div className={cn("relative mt-auto pt-10", big && "max-w-[460px]")}>
                  {c.key === "swaps" && (
                    <div className="mb-6 flex flex-wrap items-center gap-2" aria-hidden>
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
