import { midearth } from "@/data/content/home";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArenaCard } from "./ArenaCard";
import { GoldText } from "./GoldText";
import { LogoTile } from "./LogoTile";

export function MidEarthSection() {
  return (
    <Section
      ariaLabelledby="midearth-title"
      dots
      blobs={[
        { color: "mint", pos: { top: "40%", left: "85%" }, size: 680, opacity: 0.22 },
        { color: "teal", pos: { top: "75%", left: "10%" }, size: 560, opacity: 0.25 },
      ]}
      containerClassName="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,640px)] lg:items-center lg:gap-16"
    >
      <RevealGroup className="max-w-[560px]">
        <RevealItem>
          <LogoTile src={midearth.logo} wordmark={midearth.wordmark} glow="rgba(61,245,176,0.6)" />
        </RevealItem>
        <RevealItem className="mt-10">
          <Eyebrow>{midearth.eyebrow}</Eyebrow>
        </RevealItem>
        <Heading id="midearth-title" className="text-display-l mt-5">
          {midearth.title}
        </Heading>
        <RevealItem>
          <p className="text-body-l mt-6">
            <GoldText text={midearth.body} />
          </p>
        </RevealItem>
        <RevealItem>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {midearth.chips.map((c) => (
              <li key={c}>
                <Chip tone="mint">{c}</Chip>
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="mt-10">
          <Button href={midearth.cta.href}>{midearth.cta.label}</Button>
        </RevealItem>
      </RevealGroup>

      <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2" delay={0.2} stagger={0.09}>
        {midearth.arenas.map((a, i) => (
          <RevealItem as="li" key={a.title} className={i === 1 ? "sm:mt-16" : undefined}>
            <ArenaCard arena={a} badge={midearth.badge} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
