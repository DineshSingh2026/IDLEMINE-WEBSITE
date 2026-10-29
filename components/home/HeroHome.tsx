import { Fragment } from "react";
import { hero } from "@/data/content/home";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Container } from "@/components/layout/Container";
import { Grain } from "@/components/layout/Grain";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GoldText } from "./GoldText";
import { HeroVisual } from "./HeroVisual";

/*
 * Hero entrance runs on CSS keyframes (not JS) so the H1 is painted from the SSR HTML before
 * hydration — good for LCP and visible with JS disabled. The global reduced-motion rule
 * collapses these to ~0ms.
 */
const css = `
@keyframes hh-rise { from { transform: translate3d(0,110%,0); } to { transform: none; } }
@keyframes hh-up { from { opacity: 0; transform: translate3d(0,24px,0); } to { opacity: 1; transform: none; } }
@keyframes hh-fade { from { opacity: 0; } to { opacity: 1; } }
.hh-word { display:inline-block; animation: hh-rise .9s cubic-bezier(.22,1,.36,1) both; }
.hh-up { animation: hh-up .8s cubic-bezier(.22,1,.36,1) both; }
.hh-fade { animation: hh-fade 1.4s cubic-bezier(.22,1,.36,1) both; }
`;

export function HeroHome() {
  const words = hero.title.split(" ");
  const wordDelay = (i: number) => `${0.15 + i * 0.07}s`;
  const after = 0.15 + words.length * 0.07;

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <style>{css}</style>

      {/* Atmosphere: blobs, horizon glow, dot grid, grain */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundBlobs
          speed={0.2}
          blobs={[
            { color: "violet", pos: { top: "18%", left: "8%" }, size: 720, opacity: 0.42 },
            { color: "gold", pos: { top: "30%", left: "78%" }, size: 760, opacity: 0.32 },
            { color: "mint", pos: { top: "96%", left: "52%" }, size: 640, opacity: 0.22 },
          ]}
        />
        {/* faint radial horizon */}
        <div className="absolute left-1/2 top-[78%] h-[1200px] w-[2400px] -translate-x-1/2 rounded-[50%] border-t border-white/10 bg-[radial-gradient(closest-side,rgba(8,9,14,0)_70%,rgba(8,9,14,1)_100%)] shadow-[0_-40px_120px_-20px_rgba(155,123,255,0.35),inset_0_40px_80px_-40px_rgba(0,198,201,0.25)]" />
        <div className="absolute left-1/2 top-[78%] h-px w-[900px] max-w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-2/70 to-transparent" />
        <div className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_80%)]" />
        <Grain opacity={0.02} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <Container className="relative grid items-center gap-10 pb-20 pt-14 md:pt-20 lg:min-h-[calc(100svh-72px-80px)] lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-6 lg:pb-28 lg:pt-16">
        <div className="relative z-10 max-w-[720px]">
          <div className="hh-up" style={{ animationDelay: "0.05s" }}>
            <Eyebrow>
              <GoldText text={hero.eyebrow} />
            </Eyebrow>
          </div>

          <h1 id="hero-title" className="text-display-xl mt-6 text-balance text-ink">
            {words.map((w, i) => (
              <Fragment key={i}>
              <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span
                  className={hero.titleHighlight.includes(w) ? "hh-word text-grad-brand" : "hh-word"}
                  style={{ animationDelay: wordDelay(i) }}
                >
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h1>

          <p className="hh-up text-body-l mt-7 max-w-[560px]" style={{ animationDelay: `${after}s` }}>
            <GoldText text={hero.sub} />
          </p>

          <div
            className="hh-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: `${after + 0.08}s` }}
          >
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </Button>
          </div>

          <ul
            className="hh-up mt-12 flex flex-wrap gap-2.5"
            style={{ animationDelay: `${after + 0.16}s` }}
            aria-label="IdleMine at a glance"
          >
            {hero.chips.map((c) => (
              <li key={c.lead}>
                <Chip tone={c.tone} className="h-10 border-white/10 bg-white/[0.04] pr-5">
                  <span className="text-ink">{c.lead}</span>
                  <span aria-hidden className="text-ink-3">
                    ·
                  </span>
                  <span>{c.detail}</span>
                </Chip>
              </li>
            ))}
          </ul>
        </div>

        <div className="hh-fade relative mx-auto w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none" style={{ animationDelay: "0.2s" }}>
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
