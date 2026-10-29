import type { TokenStats } from "@/lib/token";

/**
 * Live running totals for the Stats band. Truthful by construction: a figure only moves when
 * DexScreener's 24h rate backs it; otherwise it holds the brief's baseline.
 */
const DAY_S = 86_400;
const DAY_MS = 86_400_000;

/** Brief: 11,350,677 total transactions as of 29 Oct 2026, 00:00 UTC. */
export const TX_BASE = 11_350_677;
export const TX_BASE_AT = Date.UTC(2026, 9, 29);

const pos = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

/** Transactions per second from the 24h count, or null when there is no live data. */
export const txRate = (s: TokenStats) => (pos(s.txns24h) ? s.txns24h / DAY_S : null);
/** USD per second from the 24h volume, or null when there is no live data. */
export const volRate = (s: TokenStats) => (pos(s.volume24h) ? s.volume24h / DAY_S : null);

/** Baseline + elapsed seconds since the brief's date × the live 24h rate. */
export function txTarget(now: number, s: TokenStats) {
  const r = txRate(s);
  return r == null ? TX_BASE : TX_BASE + Math.max(0, (now - TX_BASE_AT) / 1000) * r;
}

/** API running total (base + closed UTC days) + seconds since today's 00:00 UTC × the 24h rate. Null = no total. */
export function volTarget(now: number, s: TokenStats) {
  if (!pos(s.totalVolume)) return null;
  const r = volRate(s);
  return s.totalVolume + (r == null ? 0 : ((now % DAY_MS) / 1000) * r);
}

/**
 * Never runs backwards: follows the target when it is ahead; when a refreshed (lower) rate puts the
 * target behind, creeps forward at a quarter of the rate until the target catches up.
 */
export function advance(acc: number, target: number, dtSec: number, rate: number | null) {
  return target >= acc ? target : acc + Math.max(0, dtSec) * (rate ?? 0) * 0.25;
}

export const fmtInt = (n: number) => Math.floor(n).toLocaleString("en-US");
export const fmtUsdFull = (n: number) => "$" + Math.floor(n).toLocaleString("en-US");
