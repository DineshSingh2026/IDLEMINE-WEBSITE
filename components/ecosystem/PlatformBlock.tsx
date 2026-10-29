import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import type { Platform } from "@/data/content/ecosystem";
import { games } from "@/data/content/site";
import { Badge } from "@/components/ui/Badge";
import { Button, SmartLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Mint marks the human economy (IdleMine Games), violet the agentic one (MidEarth). */
const ECONOMY: Record<Platform["id"], { check: string }> = {
  games: { check: "text-mint" },
  midearth: { check: "text-violet" },
};

/** Alternating two-column platform block: visual panel + copy. */
export function PlatformBlock({ platform, reverse = false }: { platform: Platform; reverse?: boolean }) {
  const titleId = `platform-${platform.id}`;
  const tone = ECONOMY[platform.id];
  return (
    <article aria-labelledby={titleId} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn("relative", reverse && "lg:order-2")}>
        {platform.id === "games" ? <GamesVisual platform={platform} /> : <MidEarthVisual platform={platform} />}
      </Reveal>

      <RevealGroup className={cn("flex flex-col items-start", reverse && "lg:order-1")}>
        <RevealItem className="flex flex-wrap items-center gap-3">
          <Badge status="live">{platform.status}</Badge>
          <SmartLink
            href={platform.href}
            className="group inline-flex items-center gap-1 font-mono text-[13px] text-ink-2 transition-colors duration-200 ease-out hover:text-ink"
          >
            {platform.host}
            <ArrowUpRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </SmartLink>
        </RevealItem>
        <Heading id={titleId} size="l" className="mt-6">
          {platform.title}
        </Heading>
        <RevealItem>
          <p className="text-heading-s mt-4 text-ink-2">{platform.tag}</p>
        </RevealItem>
        <RevealItem>
          <p className="text-body mt-5 max-w-[540px]">{platform.body}</p>
        </RevealItem>
        <RevealItem as="div" className="mt-8 w-full max-w-[540px]">
          <ul className="divide-y divide-line border-y border-line">
            {platform.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3.5 py-4 text-[15px] text-ink">
                <Check aria-hidden className={cn("mt-[3px] size-4 shrink-0", tone.check)} strokeWidth={2.25} />
                {b}
              </li>
            ))}
          </ul>
        </RevealItem>
        <RevealItem className="mt-10">
          <Button href={platform.cta.href} icon="arrow">
            {platform.cta.label}
          </Button>
        </RevealItem>
      </RevealGroup>
    </article>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate aspect-[5/4] w-full overflow-hidden rounded-[20px] border border-line bg-surface", className)}>
      {children}
    </div>
  );
}

/** IdleMine Games: a flat, dimmed grid of real game covers with the logo on a surface tile. */
function GamesVisual({ platform }: { platform: Platform }) {
  const wall = games.slice(0, 12);
  return (
    <Panel>
      <div aria-hidden className="absolute inset-0 grid grid-cols-3 grid-rows-4 gap-2 p-2">
        {wall.map((g) => (
          <div key={g.title} className="relative overflow-hidden rounded-[8px]">
            <Image src={g.cover} alt="" fill sizes="200px" className="object-cover saturate-[0.55]" />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(closest-side,#05080A_35%,rgba(5,8,10,0.86))]" />
      <div className="absolute inset-0 grid place-items-center">
        <Image
          src={platform.logo.src}
          alt={platform.logo.alt}
          width={platform.logo.width}
          height={platform.logo.height}
          sizes="(min-width: 1024px) 240px, 40vw"
          className="h-auto w-[40%] mix-blend-lighten"
        />
      </div>
    </Panel>
  );
}

/** MidEarth: the two alpha arenas side by side, logo chip on top. */
function MidEarthVisual({ platform }: { platform: Platform }) {
  return (
    <Panel>
      <div className="absolute inset-0 flex items-center justify-center gap-4 px-[8%] pt-[10%] sm:gap-5">
        {platform.gallery.map((img) => (
          <figure
            key={img.src}
            className="group/arena relative aspect-[3/4] w-[44%] overflow-hidden rounded-[12px] border border-line"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 240px, 40vw"
              className="object-cover saturate-[0.8] transition-transform duration-300 ease-out group-hover/arena:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-3 sm:p-4">
              {img.badge && <Badge status="alpha">{img.badge}</Badge>}
              <span className="font-display text-[15px] font-semibold leading-tight text-ink sm:text-lg">{img.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="absolute left-5 top-5 flex items-center gap-2.5 rounded-full border border-line bg-bg py-1.5 pl-1.5 pr-4">
        <Image src={platform.logo.src} alt={platform.logo.alt} width={28} height={28} className="size-7" />
        <span className="font-display text-sm font-semibold tracking-[-0.01em] text-ink">{platform.title}</span>
      </div>
    </Panel>
  );
}
