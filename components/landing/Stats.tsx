import { stats } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { getTokenStats } from "@/lib/market";
import type { TokenStats } from "@/lib/token";
import { StatsBand } from "./stats/StatsBand";

/**
 * §3 Stats — a calm, Solana-style performance band: five large numbers on one dark panel, separated by
 * hairlines. Total Transactions and Trading Volume are live running totals (DexScreener 24h rate, ticking
 * every second); the other three count up once on reveal and then sit still. SSR carries real values.
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

      <StatsBand items={stats.items} initial={initial} serverNow={Date.now()} />

      <p className="mt-5 font-mono text-[12px] leading-5 tracking-[0.02em] text-ink-3">
        {stats.source} · Total transactions and trading volume update live from DexScreener&apos;s 24h rate
      </p>
    </Section>
  );
}

const CSS = `
.sb-tile > * { transition: opacity .7s var(--ease-out-quint) var(--d), transform .8s var(--ease-out-quint) var(--d); }
.sb-tile .sb-label { transition-delay: calc(var(--d) + 220ms); }
.sb-rule { transform-origin: left center; transition: transform .9s var(--ease-out-quint) calc(var(--d) + 120ms); }
.sb-panel[data-phase="armed"] .sb-tile > * { opacity: 0; transform: translate3d(0, 14px, 0); }
.sb-panel[data-phase="armed"] .sb-rule { transform: scaleX(0); }

/* Animated gradient border: static teal rim + a rotating conic sweep (transform only, on the compositor). */
.sb-rim { background: linear-gradient(135deg, rgba(0,198,201,.55), rgba(1,128,130,.22) 35%, rgba(1,59,61,.35) 65%, rgba(61,245,176,.45)); }
.sb-orbit {
  background: conic-gradient(from 0deg, transparent 0deg, rgba(0,198,201,0) 40deg, #00C6C9 82deg, #3DF5B0 104deg, transparent 128deg,
    transparent 210deg, rgba(0,198,201,0) 220deg, #4DD9DB 262deg, #B3F0F1 280deg, transparent 300deg, transparent 360deg);
  animation: sb-orbit 14s linear infinite; will-change: transform;
}
@keyframes sb-orbit { to { transform: translate(-50%, -50%) rotate(360deg); } }
.sb-orbit { transform: translate(-50%, -50%); }

/* Deep teal surface: teal-900 crown fading into bg-void, with a soft brand bloom. */
.sb-surface {
  background:
    radial-gradient(90% 120% at 50% -30%, rgba(0,198,201,.22), transparent 62%),
    radial-gradient(40% 70% at 100% 110%, rgba(61,245,176,.07), transparent 70%),
    radial-gradient(40% 70% at 0% 110%, rgba(155,123,255,.06), transparent 70%),
    linear-gradient(180deg, #013B3D 0%, #032A2C 40%, #061A1C 75%, #071315 100%);
  box-shadow: inset 0 1px 0 rgba(179,240,241,.10);
}
/* Fine dot texture and a teal horizon along the bottom edge. */
.sb-surface::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(179,240,241,.07) 1px, transparent 1px); background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(180deg, #000, transparent 85%); mask-image: linear-gradient(180deg, #000, transparent 85%);
}
.sb-surface::after {
  content: ""; position: absolute; inset-inline: 8%; bottom: 0; height: 1px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(0,198,201,.45), rgba(61,245,176,.45), transparent);
}

/* Teal hairline separators (right + bottom of each tile; the panel clips the outer ones). */
.sb-tile { box-shadow: 1px 0 0 0 rgba(0,198,201,.16), 0 1px 0 0 rgba(0,198,201,.16); }

/* Faint coloured top glow per tile (teal, or mint on the two live tiles). */
.sb-tile::after {
  content: ""; position: absolute; inset: 0; z-index: -2; pointer-events: none;
  background:
    radial-gradient(70% 55% at 30% 0%, rgba(0,198,201,.20), transparent 72%),
    linear-gradient(180deg, rgba(0,198,201,.05), transparent 45%);
}
.sb-tile[data-accent="mint"]::after {
  background:
    radial-gradient(70% 55% at 30% 0%, rgba(61,245,176,.17), transparent 72%),
    linear-gradient(180deg, rgba(61,245,176,.045), transparent 45%);
}

/* Numbers: subtle white to teal-100 gradient (white to pale mint on the live tiles). */
.sb-num {
  color: #F2FBFB;
  background-image: linear-gradient(180deg, #FFFFFF 15%, #B3F0F1 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.sb-num-mint { background-image: linear-gradient(180deg, #FFFFFF 10%, #A6FBDA 100%); }
/* Odometer wheels sit on their own transformed layers, which an ancestor's text clip can't reach:
   each wheel digit carries the same gradient itself (one digit is one line box tall). */
.sb-num [style*="translate3d"] > span {
  background-image: linear-gradient(180deg, #FFFFFF 15%, #B3F0F1 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.sb-num-mint [style*="translate3d"] > span { background-image: linear-gradient(180deg, #FFFFFF 10%, #A6FBDA 100%); }
/* While a wheel turns it tints teal (mint on the live tiles), as LiveCounter intends. */
.sb-num [class*="text-teal-300"] > span { -webkit-text-fill-color: #4DD9DB; }
.sb-num-mint [class*="text-teal-300"] > span { -webkit-text-fill-color: #3DF5B0; }

/* Cursor spotlight (per tile). */
.sb-tile::before {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(0,198,201,.14), transparent 70%);
  opacity: 0; transition: opacity .3s ease-out;
}
.sb-tile[data-accent="mint"]::before { background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(61,245,176,.11), transparent 70%); }
.sb-tile:hover::before { opacity: 1; }

/* Slow light sweep across the whole panel. */
.sb-sweep { overflow: hidden; border-radius: inherit; }
.sb-sweep::after {
  content: ""; position: absolute; top: -20%; bottom: -20%; left: 0; width: 34%;
  background: linear-gradient(100deg, transparent 0%, rgba(77,217,219,.035) 38%, rgba(242,251,251,.055) 50%, rgba(77,217,219,.035) 62%, transparent 100%);
  transform: translate3d(-110%, 0, 0) skewX(-14deg);
  animation: sb-sweep 11s cubic-bezier(.45,0,.25,1) 1.5s infinite;
}
@keyframes sb-sweep {
  0% { transform: translate3d(-110%, 0, 0) skewX(-14deg); }
  55%, 100% { transform: translate3d(320%, 0, 0) skewX(-14deg); }
}

/* Travelling teal → mint hairline on the top edge. */
.sb-line { overflow: hidden; background: linear-gradient(90deg, transparent, rgba(0,198,201,.18), transparent); }
.sb-line::before {
  content: ""; position: absolute; inset-block: 0; left: 0; width: 42%;
  background: linear-gradient(90deg, transparent, var(--teal-400) 40%, var(--mint) 70%, transparent);
  animation: sb-line 8s linear infinite;
}
@keyframes sb-line {
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(240%, 0, 0); }
}

/* Live dot ping. */
.sb-ping { animation: sb-ping 2.2s cubic-bezier(0,0,.2,1) infinite; }
@keyframes sb-ping {
  0% { transform: scale(1); opacity: .7; }
  75%, 100% { transform: scale(2.8); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sb-sweep, .sb-line::before { display: none; }
  .sb-orbit { animation: none; }
  .sb-ping { animation: none; opacity: 0; }
  .sb-tile > *, .sb-rule { transition: none; }
}
`;
