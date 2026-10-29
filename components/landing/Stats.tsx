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

/* Cursor spotlight (per tile). */
.sb-tile::before {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(0,198,201,.09), transparent 70%);
  opacity: 0; transition: opacity .3s ease-out;
}
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
  .sb-ping { animation: none; opacity: 0; }
  .sb-tile > *, .sb-rule { transition: none; }
}
`;
