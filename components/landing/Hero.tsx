import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import { hero } from "@/data/content/landing";
import { contract } from "@/data/content/site";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { HeroBackdrop } from "./hero/HeroBackdrop";
import { HeroOrbit } from "./hero/HeroOrbit";
import { LogoRail } from "./hero/LogoRail";

const ANCHOR = "[data-hero-mark]";
const HIGHLIGHT = "Agentic Economies";

/**
 * Runs before first paint: if WebGL is available (and not Save-Data / very low-end), mark the
 * section "gl" so the static logo never flashes before the particle mark takes over.
 * Without JS, or on failure, the static mark stays (identical footprint).
 */
const HERO_MODE_SCRIPT = `(function(){try{var s=document.currentScript&&document.currentScript.parentElement;if(!s)return;var n=navigator,c=n.connection;if(c&&c.saveData)return;if((n.hardwareConcurrency||8)<=2)return;var g=document.createElement('canvas').getContext('webgl');if(g){s.dataset.hero='gl';var e=g.getExtension('WEBGL_lose_context');e&&e.loseContext();}}catch(_){}})();`;

/**
 * CSS-only cinematic intro (~1.5s). All text is in the SSR HTML and never JS-gated; JS only adds
 * `--hs` (scroll progress) for the parallax. Everything is disabled under reduced motion.
 */
const HERO_CSS = `
@keyframes hero-rise{from{opacity:0;transform:translate3d(0,16px,0)}to{opacity:1;transform:none}}
@keyframes hero-word{
  0%{opacity:0;clip-path:inset(-.3em 100% -.35em -.1em);filter:blur(12px);transform:translate3d(0,.14em,0)}
  45%{opacity:1}
  100%{opacity:1;clip-path:inset(-.3em -.1em -.35em -.1em);filter:blur(0);transform:none}}
@keyframes hero-shimmer{0%{background-position:100% 0,0 0}48%,100%{background-position:0% 0,0 0}}
@keyframes hero-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes hero-spark{0%{transform:translateX(0);opacity:0}12%{opacity:1}100%{transform:translateX(var(--w));opacity:0}}
@keyframes hero-marquee{to{transform:translate3d(-50%,0,0)}}
@keyframes hero-cue{0%{transform:translateY(0);opacity:0}30%{opacity:1}75%{transform:translateY(11px);opacity:0}100%{transform:translateY(11px);opacity:0}}

.hero-rise{animation:hero-rise .8s cubic-bezier(.16,1,.3,1) both}
.hero-word{display:inline-block;animation:hero-word .85s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i) * 55ms + 60ms)}
.hero-grad{
  color:transparent;-webkit-background-clip:text;background-clip:text;
  background-image:linear-gradient(100deg,rgba(214,255,243,0) 38%,rgba(214,255,243,.9) 50%,rgba(214,255,243,0) 62%),var(--hero-grad);
  background-size:320% 100%,100% 100%;background-repeat:no-repeat;background-position:100% 0,0 0;
  animation:hero-word .85s cubic-bezier(.16,1,.3,1) calc(var(--i) * 55ms + 60ms) both,hero-shimmer 7.5s cubic-bezier(.45,0,.55,1) calc(1.7s + var(--j) * .9s) infinite}
.hero-draw{transform-origin:left center;animation:hero-draw 1s cubic-bezier(.65,0,.35,1) .55s both}
.hero-spark{--w:160px;animation:hero-spark 1s cubic-bezier(.65,0,.35,1) .55s both}
.hero-par-text{transform:translate3d(0,calc(var(--hs,0) * -56px),0);opacity:calc(1 - var(--hs,0) * .75)}
.hero-par-mark{transform:translate3d(0,calc(var(--hs,0) * 90px),0) scale(calc(1 - var(--hs,0) * .2));opacity:calc(1 - var(--hs,0) * .9)}
.hero-cue-wrap{opacity:calc(1 - var(--hs,0) * 6)}
.hero-cue-dot{animation:hero-cue 2.2s cubic-bezier(.45,0,.55,1) 2s infinite both}
.hero-rail-mask{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 14%,#000 86%,transparent 100%)}
.hero-rail-track{animation:hero-marquee 56s linear infinite}
.hero-rail:hover .hero-rail-track{animation-play-state:paused}
.hero-logo-img{transition:filter .3s ease-out,transform .3s ease-out}
.hero-logo:hover .hero-logo-img{filter:brightness(1.15) drop-shadow(0 0 12px var(--g));transform:scale(1.06)}
@keyframes hero-au-a{0%{transform:translate3d(-6%,-4%,0) scale(1)}50%{transform:translate3d(5%,3%,0) scale(1.12)}100%{transform:translate3d(-6%,-4%,0) scale(1)}}
@keyframes hero-au-b{0%{transform:translate3d(5%,4%,0) scale(1.08)}50%{transform:translate3d(-6%,-3%,0) scale(.94)}100%{transform:translate3d(5%,4%,0) scale(1.08)}}
@keyframes hero-au-c{0%{transform:translate3d(0,6%,0) rotate(0deg) scale(1)}50%{transform:translate3d(-4%,-5%,0) rotate(20deg) scale(1.1)}100%{transform:translate3d(0,6%,0) rotate(0deg) scale(1)}}
@keyframes hero-beam{0%,100%{opacity:.55;transform:translate3d(0,0,0) rotate(24deg)}50%{opacity:1;transform:translate3d(-4%,0,0) rotate(22deg)}}
@keyframes hero-sweep{0%{transform:translate3d(-160%,0,0) skewX(-16deg);opacity:0}6%{opacity:1}22%{transform:translate3d(620%,0,0) skewX(-16deg);opacity:0}100%{transform:translate3d(620%,0,0) skewX(-16deg);opacity:0}}
@keyframes hero-flare{0%,100%{opacity:.45;transform:scaleX(.86)}50%{opacity:.9;transform:scaleX(1)}}
.hero-au-a{animation:hero-au-a 19s ease-in-out infinite}
.hero-au-b{animation:hero-au-b 23s ease-in-out infinite}
.hero-au-c{animation:hero-au-c 29s ease-in-out infinite}
.hero-beam{animation:hero-beam 14s ease-in-out infinite}
.hero-sweep{animation:hero-sweep 9s cubic-bezier(.45,0,.55,1) 3.2s infinite both}
.hero-flare{animation:hero-flare 7s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){
  .hero-rise,.hero-word,.hero-grad,.hero-draw,.hero-spark,.hero-cue-dot,.hero-rail-track,.hero-au-a,.hero-au-b,.hero-au-c,.hero-beam,.hero-flare{animation:none}
  .hero-sweep{animation:none;opacity:0}
  .hero-beam{transform:rotate(24deg)}
  .hero-spark{opacity:0}
  .hero-cue-dot{opacity:1}
  .hero-par-text,.hero-par-mark{transform:none;opacity:1}
}
`;

const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const i = hero.title.indexOf(HIGHLIGHT);
  const lead = (i >= 0 ? hero.title.slice(0, i) : hero.title).trim().split(/\s+/).filter(Boolean);
  const tail = (i >= 0 ? hero.title.slice(i + HIGHLIGHT.length) : "").trim().split(/\s+/).filter(Boolean);
  const grad = i >= 0 ? HIGHLIGHT.split(" ") : [];
  // Each gradient word carries its own slice of the brand gradient, so the pair reads as one sweep.
  const GRADS = ["linear-gradient(90deg,#00A3A6 0%,#00C6C9 100%)", "linear-gradient(90deg,#00C6C9 0%,#3DF5B0 100%)"];
  let n = 0;

  return (
    <section
      aria-labelledby="hero-title"
      className="group/hero relative isolate flex flex-col overflow-hidden bg-bg lg:min-h-[max(720px,min(calc(100svh-72px),940px))]"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: HERO_MODE_SCRIPT }} />
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      {/* Animated particle mark + dust + cursor glow (client, lazy). */}
      <HeroBackdrop anchor={ANCHOR} />

      {/* Light beam: a soft brand-tinted shaft falling through the mark (behind the scrims). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="hero-beam absolute -top-[40%] right-[8%] h-[180%] w-[30%] origin-top mix-blend-screen lg:right-[14%] lg:w-[22%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,198,201,0) 0%, rgba(0,198,201,0.07) 30%, rgba(61,245,176,0.09) 50%, rgba(155,123,255,0.06) 70%, rgba(155,123,255,0) 100%)",
          }}
        />
      </div>

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
      {/* Top fade so the aurora never meets the header with a hard edge. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent" />
      {/* Soft bottom fade into the next section — one continuous bg-void canvas, no seam. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />

      <Container className="relative grid min-h-[min(calc(100svh-72px),920px)] flex-1 grid-cols-1 content-center gap-y-6 pb-12 pt-4 lg:min-h-0 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-12">
        {/* Mark slot — the particle field and the static fallback both fill this exact box. */}
        <div
          data-hero-mark
          aria-hidden
          className="relative mx-auto aspect-square w-[min(46vw,180px)] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:w-full lg:left-[3%] lg:max-w-[540px]"
        >
          {/* Aurora: layered teal / mint / violet light drifting slowly behind the mark. */}
          <div className="hero-par-mark pointer-events-none absolute -inset-[48%] -z-10">
            <div className="hero-au-a absolute left-[18%] top-[14%] size-[62%] rounded-full bg-[radial-gradient(closest-side,rgba(0,198,201,0.26),rgba(0,198,201,0.12)_55%,transparent)]" />
            <div className="hero-au-b absolute bottom-[12%] left-[8%] size-[58%] rounded-full bg-[radial-gradient(closest-side,rgba(155,123,255,0.26),rgba(155,123,255,0.10)_55%,transparent)]" />
            <div className="hero-au-c absolute right-[8%] top-[22%] size-[52%] rounded-full bg-[radial-gradient(closest-side,rgba(61,245,176,0.2),rgba(61,245,176,0.08)_55%,transparent)]" />
          </div>
          {/* Persistent halo (both modes) */}
          <div className="hero-par-mark pointer-events-none absolute -inset-[35%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.13)_0%,rgba(0,198,201,0.05)_38%,transparent_68%)]" />
          <div className="hero-par-mark absolute inset-0 will-change-transform">
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
            {/* Flare: an anamorphic streak through the core + a periodic light sweep across the coin. */}
            <div className="hero-flare pointer-events-none absolute left-[-14%] right-[-14%] top-1/2 hidden h-px -translate-y-1/2 mix-blend-screen lg:block bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.35)_30%,rgba(214,255,243,0.5)_50%,rgba(155,123,255,0.35)_70%,transparent)]" />
            <div className="pointer-events-none absolute inset-[2%] overflow-hidden rounded-full mix-blend-screen">
              <div className="hero-sweep absolute inset-y-0 left-0 w-[22%] bg-[linear-gradient(90deg,transparent,rgba(214,255,243,0.14)_45%,rgba(61,245,176,0.10)_60%,transparent)]" />
            </div>
            {/* Orbiting context: humans, AI agents and RWA tokens around the mark (desktop). */}
            <div className="absolute inset-0 hidden lg:block">
              <HeroOrbit />
            </div>
          </div>
        </div>

        <div className="hero-par-text relative lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <h1
            id="hero-title"
            className="text-display-xl font-semibold text-balance text-ink lg:!text-[clamp(58px,5.4vw,80px)] lg:!leading-[1]"
          >
            {lead.map((w) => (
              <Fragment key={`l${n}`}>
                <span className="hero-word" style={{ "--i": n++ } as CSSProperties}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
            {grad.map((w, j) => (
              <Fragment key={`g${j}`}>
                <span
                  className="hero-word hero-grad"
                  style={{ "--i": n++, "--j": j, "--hero-grad": GRADS[j % GRADS.length] } as CSSProperties}
                >
                  {w}
                </span>
                {j < grad.length - 1 || tail.length ? " " : null}
              </Fragment>
            ))}
            {tail.map((w, j) => (
              <Fragment key={`t${j}`}>
                <span className="hero-word" style={{ "--i": n++ } as CSSProperties}>
                  {w}
                </span>
                {j < tail.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          {/* Economies divider: draws from the left, a spark runs along it once. */}
          <div aria-hidden className="relative mt-6 h-px w-40 lg:mt-8">
            <div className="hero-draw absolute inset-0 bg-[linear-gradient(90deg,#00C6C9_0%,#9B7BFF_100%)]" />
            <div className="hero-spark absolute -top-[1.5px] left-0 h-1 w-6 rounded-full bg-[radial-gradient(closest-side,rgba(230,255,250,0.95),rgba(230,255,250,0))]" />
          </div>

          <p
            className="hero-rise mt-5 max-w-[560px] text-pretty text-[16px] leading-[1.6] text-ink-2 lg:mt-6 lg:text-body-l"
            style={d(680)}
          >
            {hero.body}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-9">
            <div className="hero-rise grid" style={d(840)}>
              <Button href={hero.primary.href} variant="primary" icon="external">
                {hero.primary.label}
              </Button>
            </div>
            <div className="hero-rise grid" style={d(940)}>
              <Button href={hero.secondary.href} variant="secondary" icon="arrow">
                {hero.secondary.label}
              </Button>
            </div>
          </div>

          <div className="hero-rise mt-10 hidden items-center gap-3 sm:flex" style={d(1060)}>
            <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3">Contract</span>
            <span className="h-3 w-px bg-line" aria-hidden />
            <CopyAddress address={contract} compact className="[&_code]:text-[13px] [&_code]:text-ink-2" />
          </div>
        </div>
      </Container>

      {/* Scroll cue (desktop) — sits just above the logo rail. */}
      <div aria-hidden className="relative hidden lg:block">
        <div className="hero-cue-wrap absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="hero-rise flex h-[34px] w-[20px] justify-center rounded-full border border-white/[0.16] pt-[7px]" style={d(1500)}>
            <span className="hero-cue-dot block h-[6px] w-[2px] rounded-full bg-teal-400" />
          </div>
        </div>
      </div>

      <div className="hero-rise relative" style={d(1250)}>
        <LogoRail />
      </div>
    </section>
  );
}
