import Image from "next/image";
import { ecosystem } from "@/data/content/home";
import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GameCard } from "./GameCard";
import { GoldText } from "./GoldText";
import { LogoTile } from "./LogoTile";

export function EcosystemSection() {
  return (
    <Section
      ariaLabelledby="ecosystem-title"
      blobs={[
        { color: "violet", pos: { top: "45%", left: "12%" }, size: 760, opacity: 0.34 },
        { color: "gold", pos: { top: "20%", left: "92%" }, size: 520, opacity: 0.2 },
      ]}
      containerClassName="grid gap-14 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] lg:items-center lg:gap-16"
    >
      <RevealGroup as="ul" className="order-2 grid gap-5 sm:grid-cols-2 lg:order-1" delay={0.2} stagger={0.09}>
        {ecosystem.games.map((g, i) => (
          <RevealItem as="li" key={g.title} className={i === 0 ? "sm:mt-16" : undefined}>
            <GameCard game={g} accent={i === 0 ? "violet" : "gold"} />
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup className="order-1 max-w-[560px] lg:order-2">
        <RevealItem>
          <LogoTile src={ecosystem.logo} wordmark={ecosystem.wordmark} glow="rgba(15,163,160,0.7)" />
        </RevealItem>
        <RevealItem className="mt-10">
          <Eyebrow>{ecosystem.eyebrow}</Eyebrow>
        </RevealItem>
        <Heading id="ecosystem-title" className="text-display-l mt-5">
          {ecosystem.title}
        </Heading>
        <RevealItem>
          <p className="text-body-l mt-6">{ecosystem.body}</p>
        </RevealItem>
        <RevealItem>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {ecosystem.chips.map((c, i) => (
              <li key={c}>
                <Chip tone={i === 1 ? "gold" : "violet"}>
                  <GoldText text={c} />
                </Chip>
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="mt-9">
          {/* Official badge artwork includes its own clear-space; offset it so the visible edge aligns. */}
          <a
            href={ecosystem.playStore.href}
            target="_blank"
            rel="noopener noreferrer"
            className="-ml-[11px] inline-block rounded-lg transition-transform duration-300 ease-quint hover:-translate-y-0.5"
          >
            <Image
              src={ecosystem.playStore.badge}
              alt={ecosystem.playStore.alt}
              width={646}
              height={250}
              sizes="180px"
              className="h-auto w-[180px]"
            />
          </a>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
