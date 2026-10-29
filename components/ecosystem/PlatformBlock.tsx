import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import type { Platform } from "@/data/content/ecosystem";
import { games } from "@/data/content/site";
import { Badge } from "@/components/ui/Badge";
import { Button, SmartLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Alternating two-column platform block: visual panel + copy. */
export function PlatformBlock({ platform, reverse = false }: { platform: Platform; reverse?: boolean }) {
  const titleId = `platform-${platform.id}`;
  return (
    <article aria-labelledby={titleId} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal className={cn("relative", reverse && "lg:order-2")}>
        {platform.id === "games" ? <GamesVisual platform={platform} /> : <MidEarthVisual platform={platform} />}
      </Reveal>

      <RevealGroup className={cn("flex flex-col items-start", reverse && "lg:order-1")}>
        <RevealItem className="flex flex-wrap items-center gap-3">
          <Badge status="live">{platform.status}</Badge>
          <SmartLink
            href={platform.href}
            className="group inline-flex items-center gap-1 font-mono text-[13px] text-ink-2 transition-colors duration-300 hover:text-gold-2"
          >
            {platform.host}
            <ArrowUpRight
              aria-hidden
              className="size-3.5 transition-transform duration-300 ease-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </SmartLink>
        </RevealItem>
        <Heading id={titleId} size="l" className="text-display-l mt-6">
          {platform.title}
        </Heading>
        <RevealItem>
          <p className="mt-4 font-display text-heading-s text-grad-brand">{platform.tag}</p>
        </RevealItem>
        <RevealItem>
          <p className="text-body mt-5 max-w-[540px]">{platform.body}</p>
        </RevealItem>
        <RevealItem as="div" className="mt-8 w-full max-w-[540px]">
          <ul className="divide-y divide-line border-y border-line">
            {platform.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3.5 py-4 text-[15px] text-ink">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-mint/30 bg-mint/10 text-mint"
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
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
    <div
      className={cn(
        "relative isolate aspect-[5/4] w-full overflow-hidden rounded-xl border border-line bg-surface",
        "shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04]" />
    </div>
  );
}

/** IdleMine Games: a tilted wall of real game covers with the logo floating above. */
function GamesVisual({ platform }: { platform: Platform }) {
  const wall = games.slice(0, 15);
  return (
    <Panel>
      <div aria-hidden className="absolute inset-0 [perspective:1200px]">
        <div
          className="absolute left-1/2 top-1/2 grid w-[150%] grid-cols-3 gap-3"
          style={{ transform: "translate(-50%,-50%) rotateX(52deg) rotateZ(-24deg)" }}
        >
          {wall.map((g) => (
            <div key={g.title} className="relative aspect-[960/498] overflow-hidden rounded-md border border-white/10">
              <Image src={g.cover} alt="" fill sizes="240px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,9,14,0.35)_0%,rgba(8,9,14,0.85)_55%,#08090e_90%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(25,251,155,0.16),transparent_45%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="float-y relative w-[46%]">
          <div aria-hidden className="absolute inset-[-12%] rounded-full bg-cyan/20 blur-3xl" />
          <Image
            src={platform.logo.src}
            alt={platform.logo.alt}
            width={platform.logo.width}
            height={platform.logo.height}
            sizes="(min-width: 1024px) 280px, 46vw"
            className="relative h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </Panel>
  );
}

/** MidEarth: two alpha arenas stacked with an offset, logo tile on top. */
function MidEarthVisual({ platform }: { platform: Platform }) {
  return (
    <Panel className="bg-[radial-gradient(120%_100%_at_30%_0%,#10201a_0%,var(--surface)_60%)]">
      <div aria-hidden className="absolute inset-0 dot-grid opacity-50" />
      <div aria-hidden className="absolute -left-10 bottom-0 size-[60%] rounded-full bg-mint/15 blur-3xl" />
      <div aria-hidden className="absolute -right-10 top-0 size-[50%] rounded-full bg-violet/20 blur-3xl" />

      <div className="absolute inset-0 flex items-center justify-center gap-[4%] px-[8%]">
        {platform.gallery.map((img, i) => (
          <figure
            key={img.src}
            className={cn(
              "group/arena relative aspect-[3/4] w-[42%] overflow-hidden rounded-lg border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]",
              i === 0 ? "-translate-y-[6%] -rotate-2" : "translate-y-[8%] rotate-2",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 240px, 40vw"
              className="object-cover transition-transform duration-700 ease-quint group-hover/arena:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-3 sm:p-4">
              {img.badge && <Badge status="alpha">{img.badge}</Badge>}
              <span className="font-display text-[15px] font-semibold leading-tight text-ink sm:text-lg">{img.label}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="absolute left-5 top-5 flex items-center gap-2.5 rounded-full border border-line bg-bg/70 py-1.5 pl-1.5 pr-4 backdrop-blur-md">
        <Image src={platform.logo.src} alt={platform.logo.alt} width={28} height={28} className="size-7" />
        <span className="font-display text-sm font-semibold tracking-[-0.01em] text-ink">{platform.title}</span>
      </div>
    </Panel>
  );
}
