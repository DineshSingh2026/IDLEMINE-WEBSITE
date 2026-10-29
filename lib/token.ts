export const IDLE_MINT = "BjcRmwm8e25RgjkyaFE56fc7bxRgGPw96JUkXRJFEroT";
export const DEX_URL = `https://dexscreener.com/solana/${IDLE_MINT}`;
export const DEX_EMBED = `${DEX_URL}?embed=1&theme=dark`;
export const RAYDIUM_POOLS = `https://raydium.io/liquidity-pools/?token=${IDLE_MINT}`;
export const RAYDIUM_SWAP = `https://raydium.io/swap/?outputMint=${IDLE_MINT}`;
export const SOLSCAN = `https://solscan.io/token/${IDLE_MINT}`;

export const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${IDLE_MINT}`;
export const COINGECKO_ID = "idlemine";
/** Hand-counted running total volume through `day` (from the live site config). */
export const TOTAL_VOLUME_BASE = { total: 213589723.94, day: "2026-10-22" };

export type PoolStat = {
  pairAddress: string;
  dexId: string;
  label: string; // e.g. "IDLE / SOL"
  url: string;
  priceUsd: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  txns24h: number | null;
};

export type TokenStats = {
  ok: boolean;
  priceUsd: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
  fdv: number | null;
  liquidityUsd: number | null;
  volume24h: number | null;
  totalVolume: number | null;
  txns24h: number | null;
  pairs: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  pairUrl: string;
  pools: PoolStat[];
  updatedAt: string;
};

export const EMPTY_STATS: TokenStats = {
  ok: false,
  priceUsd: null,
  priceChange24h: null,
  marketCap: null,
  fdv: null,
  liquidityUsd: null,
  volume24h: null,
  totalVolume: TOTAL_VOLUME_BASE.total,
  txns24h: null,
  pairs: null,
  circulatingSupply: null,
  totalSupply: null,
  pairUrl: DEX_URL,
  pools: [],
  updatedAt: new Date(0).toISOString(),
};
