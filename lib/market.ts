import "server-only";
import {
  COINGECKO_ID,
  DEXSCREENER_API,
  DEX_URL,
  EMPTY_STATS,
  IDLE_MINT,
  TOTAL_VOLUME_BASE,
  type PoolStat,
  type TokenStats,
} from "./token";

type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: { address: string; symbol: string };
  quoteToken: { address: string; symbol: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  marketCap?: number;
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const utcDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/**
 * Running total volume = hand-counted base + every finished UTC day since the base day,
 * from CoinGecko daily candles (same logic as the live site). Falls back to the base.
 */
async function totalVolume(): Promise<number> {
  const today = utcDay(Date.now() - 15 * 60e3);
  const days: string[] = [];
  for (let t = Date.parse(TOTAL_VOLUME_BASE.day) + 864e5; utcDay(t) < today; t += 864e5) days.push(utcDay(t));
  if (!days.length) return TOTAL_VOLUME_BASE.total;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${COINGECKO_ID}/market_chart?vs_currency=usd&interval=daily&days=${days.length + 2}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as { total_volumes?: [number, number][] };
    let sum = 0;
    for (const [ts, v] of j.total_volumes ?? []) {
      if (ts % 864e5 === 0 && days.includes(utcDay(ts - 864e5))) sum += v || 0;
    }
    return Math.round((TOTAL_VOLUME_BASE.total + sum) * 100) / 100;
  } catch {
    return TOTAL_VOLUME_BASE.total;
  }
}

export async function getTokenStats(): Promise<TokenStats> {
  const [market, total] = await Promise.all([
    fetch(DEXSCREENER_API, { next: { revalidate: 15 } })
      .then((r) => (r.ok ? (r.json() as Promise<{ pairs?: DexPair[] | null }>) : null))
      .catch(() => null),
    totalVolume(),
  ]);

  const pairs = (market?.pairs ?? [])
    .filter((p) => p.chainId === "solana" && p.baseToken?.address === IDLE_MINT)
    .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));

  if (!pairs.length) return { ...EMPTY_STATS, totalVolume: total, updatedAt: new Date().toISOString() };

  const top = pairs[0];
  const price = num(Number(top.priceUsd));
  const sum = (fn: (p: DexPair) => number | undefined) => pairs.reduce((t, p) => t + (fn(p) ?? 0), 0);
  const marketCap = num(top.marketCap) ?? num(top.fdv);
  const fdv = num(top.fdv);

  const pools: PoolStat[] = pairs.map((p) => ({
    pairAddress: p.pairAddress,
    dexId: p.dexId,
    label: `${p.baseToken.symbol} / ${p.quoteToken.symbol}`,
    url: p.url,
    priceUsd: num(Number(p.priceUsd)),
    liquidityUsd: num(p.liquidity?.usd),
    volume24h: num(p.volume?.h24),
    txns24h: (p.txns?.h24?.buys ?? 0) + (p.txns?.h24?.sells ?? 0),
  }));

  return {
    ok: true,
    priceUsd: price,
    priceChange24h: num(top.priceChange?.h24),
    marketCap,
    fdv,
    liquidityUsd: sum((p) => p.liquidity?.usd),
    volume24h: sum((p) => p.volume?.h24),
    totalVolume: total,
    txns24h: sum((p) => (p.txns?.h24?.buys ?? 0) + (p.txns?.h24?.sells ?? 0)),
    pairs: pairs.length,
    circulatingSupply: price && marketCap ? marketCap / price : null,
    totalSupply: price && fdv ? fdv / price : null,
    pairUrl: top.url || DEX_URL,
    pools,
    updatedAt: new Date().toISOString(),
  };
}
