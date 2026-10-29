import Image from "next/image";
import { hero } from "@/data/content/landing";
import { contract } from "@/data/content/site";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { HeroBackdrop } from "./hero/HeroBackdrop";

const ANCHOR = "[data-hero-mark]";
const HIGHLIGHT = "Agentic Economies";

/**
 * Runs before first paint: if WebGL is available (and not Save-Data / very low-end), mark the
 * section "gl" so the static logo never flashes before the particle mark takes over.
 * Without JS, or on failure, the static mark stays (identical footprint).
 */
const HERO_MODE_SCRIPT = `(function(){try{var s=document.currentScript&&document.currentScript.parentElement;if(!s)return;var n=navigator,c=n.connection;if(c&&c.saveData)return;if((n.hardwareConcurrency||8)<=2)return;var g=document.createElement('canvas').getContext('webgl');if(g){s.dataset.hero='gl';var e=g.getExtension('WEBGL_lose_context');e&&e.loseContext();}}catch(_){}})();`;

/** CSS-only entrance (text is in the SSR HTML and never JS-gated). Disabled under reduced motion. */
const HERO_CSS = `
@keyframes hero-rise{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
.hero-rise{animation:hero-rise .7s cubic-bezier(.16,1,.3,1) both}
@media (prefers-reduced-motion:reduce){.hero-rise{animation:none}}
`;

export function Hero() {
  const i = hero.title.indexOf(HIGHLIGHT);
  const lead = i >= 0 ? hero.title.slice(0, i) : hero.title;
  const tail = i >= 0 ? hero.title.slice(i + HIGHLIGHT.length) : "";

  return (
    <section
      aria-labelledby="hero-title"
      className="group/hero relative isolate overflow-hidden bg-bg"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: HERO_MODE_SCRIPT }} />
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      {/* Animated particle mark + dust (client, lazy). */}
      <HeroBackdrop anchor={ANCHOR} />

      {/* Scrims: keep the copy on a calm, near-solid ground over every frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "radial-gradient(ellipse 52% 70% at 22% 52%, rgba(5,8,10,0.92) 0%, rgba(5,8,10,0.7) 45%, rgba(5,8,10,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] lg:hidden"
        style={{ background: "linear-gradient(180deg, rgba(5,8,10,0) 0%, rgba(5,8,10,0.88) 22%, rgba(5,8,10,0.94) 100%)" }}
      />
      {/* Soft bottom fade into the next section — one continuous bg-void canvas, no seam. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />

      <Container className="relative grid min-h-[min(calc(100svh-72px),920px)] grid-cols-1 content-center gap-y-6 pb-12 pt-4 lg:min-h-[max(640px,min(calc(100svh-72px),900px))] lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-20">
        {/* Mark slot — the particle field and the static fallback both fill this exact box. */}
        <div
          data-hero-mark
          aria-hidden
          className="relative mx-auto aspect-square w-[min(44vw,172px)] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:w-full lg:max-w-[480px]"
        >
          {/* Persistent halo (both modes) */}
          <div className="pointer-events-none absolute -inset-[35%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.13)_0%,rgba(0,198,201,0.05)_38%,transparent_68%)]" />
          {/* Static mark: no-JS, no-WebGL, Save-Data, low-end. Hidden pre-paint when WebGL takes over. */}
          <div className="absolute inset-0 transition-opacity duration-300 ease-out group-data-[hero=gl]/hero:opacity-0">
            {/* Coin rim + outer orbit, echoing the particle version */}
            <div className="absolute inset-[1%] rounded-full border border-[#00C6C9]/25" />
            <div className="absolute -inset-[10%] rounded-full border border-dashed border-[#00C6C9]/12" />
            {/* The official mark, unaltered, at a calm size (clear space = the rim gap) */}
            <div className="absolute inset-[22%]">
              <Image
                src="/assets/img/idlemine-mark.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 270px, 100px"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <h1
            id="hero-title"
            className="hero-rise text-display-xl font-semibold text-balance text-ink lg:!text-[clamp(58px,5.4vw,80px)] lg:!leading-[1]"
          >
            {lead}
            {i >= 0 && <span className="text-grad-brand [background-size:100%_100%]">{HIGHLIGHT}</span>}
            {tail}
          </h1>

          <div
            aria-hidden
            className="hero-rise mt-6 h-px w-28 lg:mt-8 bg-[linear-gradient(90deg,#00C6C9_0%,#9B7BFF_100%)] [animation-delay:120ms]"
          />

          <p className="hero-rise mt-5 max-w-[560px] text-pretty text-[16px] leading-[1.6] text-ink-2 lg:mt-6 [animation-delay:160ms] lg:text-body-l">
            {hero.body}
          </p>

          <div className="hero-rise mt-7 flex lg:mt-9 flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center">
            <Button href={hero.primary.href} variant="primary" icon="external">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" icon="arrow">
              {hero.secondary.label}
            </Button>
          </div>

          <div className="hero-rise mt-10 hidden items-center gap-3 [animation-delay:320ms] sm:flex">
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3">Contract</span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <CopyAddress address={contract} compact className="[&_code]:text-[13px] [&_code]:text-ink-2" />
          </div>
        </div>
      </Container>
    </section>
  );
}
