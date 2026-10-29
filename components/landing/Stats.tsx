import { stats } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { getTokenStats } from "@/lib/market";
import type { TokenStats } from "@/lib/token";
import { StatsBand } from "./stats/StatsBand";

/**
 * §3 Stats — open, Solana-style performance figures: five huge gradient numbers straight on the canvas,
 * separated only by spacing and fading vertical hairlines, over drifting borderless brand light.
 * Total Transactions and Trading Volume are live running totals (DexScreener 24h rate, ticking every
 * second); the other three count up once on reveal and then sit still. SSR carries real values.
 */
export async function Stats() {
  // Server-fetched market data so the first paint already shows the live totals (never zeros, no swap).
  const initial = await Promise.race<TokenStats | undefined>([
    getTokenStats().catch(() => undefined),
    new Promise((r) => setTimeout(() => r(undefined), 2500)),
  ]);

  return (
    <Section ariaLabelledby="stats-title">
      <style href="idle-stats-band" precedence="medium">{CSS}</style>
      <div className="max-w-[880px]">
        <Heading id="stats-title" size="l">
          {stats.title}
        </Heading>
      </div>

      <StatsBand items={stats.items} initial={initial} serverNow={Date.now()} layout="pair" />

      <p className="mt-12 font-mono text-[12px] leading-5 tracking-[0.02em] text-ink-3 lg:mt-14">
        {stats.source} · Total transactions update live from DexScreener&apos;s 24h rate
      </p>
    </Section>
  );
}

/**
 * Four-up stats strip that sits straight after the RWA section: Trading Volume (live), RWAs paired,
 * LP fees and APY. Stacked on phones, 2×2 from md, four columns from xl (StatsBand "quad").
 */
export async function StatsStrip() {
  const initial = await Promise.race<TokenStats | undefined>([
    getTokenStats().catch(() => undefined),
    new Promise((r) => setTimeout(() => r(undefined), 2500)),
  ]);

  return (
    <Section ariaLabelledby="stats-strip-title" className="pt-0 md:pt-0 lg:pt-0">
      <style href="idle-stats-band" precedence="medium">{CSS}</style>
      <h2 id="stats-strip-title" className="sr-only">
        $IDLE market figures
      </h2>

      <StatsBand items={stats.strip} initial={initial} serverNow={Date.now()} layout="quad" />

      <p className="mt-12 font-mono text-[12px] leading-5 tracking-[0.02em] text-ink-3 lg:mt-14">
        {stats.source} · Trading volume updates live from DexScreener&apos;s 24h rate
      </p>
    </Section>
  );
}

const CSS = `
/* Entrance: staggered rise per figure, hairlines draw from the centre. */
.sb-fig > * { transition: opacity .7s var(--ease-out-quint) var(--d), transform .8s var(--ease-out-quint) var(--d); }
.sb-fig .sb-label { transition-delay: calc(var(--d) + 220ms); }
.sb-rule { transform-origin: left center; transition: transform .9s var(--ease-out-quint) calc(var(--d) + 120ms); }
.sb-fig::before { transition: transform 1.1s var(--ease-out-quint) calc(var(--d) + 160ms), opacity 1.1s ease-out calc(var(--d) + 160ms); }
.sb-panel[data-phase="armed"] .sb-fig > * { opacity: 0; transform: translate3d(0, 14px, 0); }
.sb-panel[data-phase="armed"] .sb-rule { transform: scaleX(0); }
.sb-panel[data-phase="armed"] .sb-fig::before { transform: scaleY(0); opacity: 0; }

/* Separation: spacing plus a faint vertical hairline that fades out at both ends (never a closed shape). */
.sb-fig::before {
  content: none; position: absolute; left: 0; top: -12px; bottom: -12px; width: 1px; pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(0,198,201,.34) 30%, rgba(61,245,176,.22) 70%, transparent 100%);
}
@media (min-width: 768px) and (max-width: 1279.98px) {
  .sb-fig:nth-child(even) { padding-left: 40px; }
  .sb-fig:nth-child(even)::before { content: ""; }
}
@media (min-width: 1280px) {
  .sb-fig { padding-inline: 20px; }
  .sb-fig:first-child { padding-left: 0; }
  .sb-fig:last-child { padding-right: 0; }
  .sb-fig:not(:first-child)::before { content: ""; }
}
/* §3 "pair" layout goes three-up from lg: the third figure gets the same indent + hairline before xl. */
@media (min-width: 1024px) and (max-width: 1279.98px) {
  .sb-panel[data-layout="pair"] .sb-fig:nth-child(3) { padding-left: 40px; }
  .sb-panel[data-layout="pair"] .sb-fig:nth-child(3)::before { content: ""; }
}

/* Borderless brand light behind the numbers: soft radial glows (no edges) drifting slowly. */
.sb-glow { border-radius: 9999px; filter: blur(48px); will-change: transform; }
.sb-glow-a { background: radial-gradient(closest-side, rgba(0,198,201,.26), rgba(0,198,201,.09) 55%, transparent); animation: sb-drift-a 22s ease-in-out infinite; }
.sb-glow-b { background: radial-gradient(closest-side, rgba(61,245,176,.18), rgba(61,245,176,.06) 55%, transparent); animation: sb-drift-b 27s ease-in-out infinite; }
.sb-glow-c { background: radial-gradient(closest-side, rgba(155,123,255,.18), rgba(155,123,255,.06) 55%, transparent); animation: sb-drift-c 31s ease-in-out infinite; }
@keyframes sb-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(9%,6%,0) scale(1.12); } }
@keyframes sb-drift-b { 0%,100% { transform: translate3d(0,4%,0) scale(1.05); } 50% { transform: translate3d(-10%,-6%,0) scale(.92); } }
@keyframes sb-drift-c { 0%,100% { transform: translate3d(0,-4%,0) scale(.95); } 50% { transform: translate3d(-8%,8%,0) scale(1.1); } }

/* Numbers: white to teal-100 (white to mint on the live figures) with a slow light sweep through the glyphs. */
.sb-num {
  --sb-g: linear-gradient(180deg, #FFFFFF 18%, #B3F0F1 100%);
  color: #F2FBFB;
  background-image: linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(214,255,243,.95) 50%, rgba(255,255,255,0) 60%), var(--sb-g);
  background-size: 340% 100%, 100% 100%; background-repeat: no-repeat; background-position: 100% 0, 0 0;
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  padding: .06em .08em .12em 0; margin: -.06em -.08em -.12em 0;
  filter: drop-shadow(0 0 28px rgba(0,198,201,.16));
  animation: sb-shine 9s cubic-bezier(.45,0,.55,1) calc(2.2s + var(--i) * .32s) infinite;
}
.sb-num-mint { --sb-g: linear-gradient(180deg, #FFFFFF 12%, #A6FBDA 100%); filter: drop-shadow(0 0 28px rgba(61,245,176,.16)); }
@keyframes sb-shine { 0% { background-position: 100% 0, 0 0; } 42%, 100% { background-position: 0% 0, 0 0; } }
/* While the odometer runs, its wheels can't share the sweep: keep the live figure on its plain gradient. */
.sb-num[data-rolling] { animation: none; background-image: var(--sb-g); background-size: 100% 100%; }
/* Odometer wheels sit on their own transformed layers, which an ancestor's text clip can't reach:
   each wheel digit carries the same gradient itself (one digit is one line box tall). */
.sb-num [style*="translate3d"] > span {
  background-image: linear-gradient(180deg, #FFFFFF 18%, #B3F0F1 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.sb-num-mint [style*="translate3d"] > span { background-image: linear-gradient(180deg, #FFFFFF 12%, #A6FBDA 100%); }
/* While a wheel turns it tints teal (mint on the live figures), as LiveCounter intends. */
.sb-num [class*="text-teal-300"] > span { -webkit-text-fill-color: #4DD9DB; }
.sb-num-mint [class*="text-teal-300"] > span { -webkit-text-fill-color: #3DF5B0; }

/* Live dot ping. */
.sb-ping { animation: sb-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }
@keyframes sb-ping {
  0% { transform: scale(1); opacity: .7; }
  75%, 100% { transform: scale(2.8); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sb-glow, .sb-num { animation: none; }
  .sb-ping { animation: none; opacity: 0; }
  .sb-fig > *, .sb-rule, .sb-fig::before { transition: none; }
}
`;
