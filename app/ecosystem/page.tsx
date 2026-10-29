import type { Viewport } from "next";
import { pageMeta } from "@/lib/seo";
import { agents, ecosystemMeta, library, platforms } from "@/data/content/ecosystem";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { EcosystemHero } from "@/components/ecosystem/EcosystemHero";
import { PlatformBlock } from "@/components/ecosystem/PlatformBlock";
import { AgentRoleCards } from "@/components/ecosystem/AgentRoleCards";
import { GameLibraryGrid } from "@/components/ecosystem/GameLibraryGrid";
import { ComingNext } from "@/components/ecosystem/ComingNext";

export const metadata = pageMeta(ecosystemMeta);

export const viewport: Viewport = { themeColor: "#08090e" };

export default function EcosystemPage() {
  return (
    <>
      <EcosystemHero />

      <Section
        className="pt-16 md:pt-24 lg:pt-28"
        blobs={[
          { color: "teal", pos: { top: "18%", left: "12%" }, size: 620, opacity: 0.18 },
          { color: "violet", pos: { top: "78%", left: "90%" }, size: 680, opacity: 0.22 },
        ]}
      >
        <div className="flex flex-col gap-28 md:gap-40">
          {platforms.map((p, i) => (
            <PlatformBlock key={p.id} platform={p} reverse={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section
        ariaLabelledby="agents-title"
        dots
        blobs={[{ color: "violet", pos: { top: "45%", left: "50%" }, size: 900, opacity: 0.2 }]}
      >
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Reveal>
            <Eyebrow>{agents.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="agents-title" size="l" className="text-display-l mt-5">
            {agents.title}
          </Heading>
        </div>
        <div className="mt-16 md:mt-20">
          <AgentRoleCards />
        </div>
      </Section>

      <Section
        id="games"
        ariaLabelledby="library-title"
        blobs={[
          { color: "gold", pos: { top: "10%", left: "80%" }, size: 560, opacity: 0.12 },
          { color: "mint", pos: { top: "70%", left: "8%" }, size: 560, opacity: 0.12 },
        ]}
      >
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <Reveal>
            <Eyebrow>{library.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="library-title" size="l" highlight={library.highlight} className="text-display-l mt-5">
            {library.title}
          </Heading>
        </div>
        <div className="mt-12">
          <GameLibraryGrid />
        </div>
      </Section>

      <Section ariaLabelledby="coming-next-title" className="pt-0 md:pt-0 lg:pt-0">
        <ComingNext />
      </Section>
    </>
  );
}
