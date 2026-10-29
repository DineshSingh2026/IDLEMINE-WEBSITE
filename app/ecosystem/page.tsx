import type { Viewport } from "next";
import { pageMeta } from "@/lib/seo";
import { agents, ecosystemMeta, library, platforms } from "@/data/content/ecosystem";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { EcosystemHero } from "@/components/ecosystem/EcosystemHero";
import { PlatformBlock } from "@/components/ecosystem/PlatformBlock";
import { AgentRoleCards } from "@/components/ecosystem/AgentRoleCards";
import { GameLibraryGrid } from "@/components/ecosystem/GameLibraryGrid";
import { ComingNext } from "@/components/ecosystem/ComingNext";

export const metadata = pageMeta(ecosystemMeta);

export const viewport: Viewport = { themeColor: "#05080A" };

/**
 * One continuous bg-void canvas. Sections are separated by a container-width hairline with
 * half the section rhythm on each side, so content-to-content is 120px desktop / 64px mobile.
 */
const band = "border-t border-line py-8 md:py-12 lg:py-[60px]";

function Band({ id, labelledBy, className, children }: { id?: string; labelledBy?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-[72px]">
      <Container>
        <div className={cn(band, className)}>{children}</div>
      </Container>
    </section>
  );
}

export default function EcosystemPage() {
  return (
    <>
      <EcosystemHero />

      {platforms.map((p, i) => (
        <Band key={p.id}>
          <PlatformBlock platform={p} reverse={i % 2 === 1} />
        </Band>
      ))}

      <Band labelledBy="agents-title">
        <div className="flex max-w-[760px] flex-col items-start">
          <Reveal>
            <Eyebrow>{agents.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="agents-title" size="l" className="mt-5">
            {agents.title}
          </Heading>
        </div>
        <div className="mt-12">
          <AgentRoleCards />
        </div>
      </Band>

      <Band id="games" labelledBy="library-title">
        <div className="flex max-w-[760px] flex-col items-start">
          <Reveal>
            <Eyebrow>{library.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="library-title" size="l" className="mt-5">
            {library.title}
          </Heading>
        </div>
        <div className="mt-12">
          <GameLibraryGrid />
        </div>
      </Band>

      <Band labelledBy="coming-next-title" className="border-t-0 pt-0 md:pt-0 lg:pt-0 pb-16 md:pb-24 lg:pb-[120px]">
        <ComingNext />
      </Band>
    </>
  );
}
