// /liquidity page copy — SPEC §5.5 (verbatim).
export const liquidityMeta = {
  title: "Liquidity pools · earn yield on IDLE / SOL",
  description:
    "Provide liquidity, earn yield, and keep full custody of your assets through Raydium liquidity pools, including IDLE / SOL and tokenized real-world assets.",
  og: "/assets/og/liquidity.png",
  path: "/liquidity",
};

export const liquidityHero = {
  eyebrow: "Liquidity",
  title: "Liquidity Pools",
  sub: "Provide liquidity, earn yield, and maintain full custody of assets. Gain exposure to tokenized real-world assets through Raydium liquidity pools with no intermediaries.",
  visual: "/assets/img/idlemine-logo.png",
  chips: ["No intermediaries", "Competitive APY", "Full asset control"],
};

/** Tokenized real-world assets (xStocks) — logos are the official Backed Finance token images. */
export type RwaAsset = { name: string; ticker: string; logo: string };
export const rwaAssets: RwaAsset[] = [
  { name: "Tesla", ticker: "TSLAx", logo: "/assets/logos/round/TSLA.png" },
  { name: "Gold", ticker: "GLDx", logo: "/assets/logos/round/GLD.png" },
  { name: "Nvidia", ticker: "NVDAx", logo: "/assets/logos/round/NVDA.png" },
  { name: "QQQ", ticker: "QQQx", logo: "/assets/logos/round/QQQ.png" },
  { name: "Coinbase", ticker: "COINx", logo: "/assets/logos/round/COIN.png" },
  { name: "Robinhood", ticker: "HOODx", logo: "/assets/logos/round/HOOD.png" },
];

/** Every quote token with a downloaded official logo (used by the pool list). */
export const tokenLogos: Record<string, string> = {
  IDLE: "/assets/img/idlemine-mark.webp",
  TSLAx: "/assets/logos/round/TSLA.png",
  GLDx: "/assets/logos/round/GLD.png",
  NVDAx: "/assets/logos/round/NVDA.png",
  QQQx: "/assets/logos/round/QQQ.png",
  COINx: "/assets/logos/round/COIN.png",
  HOODx: "/assets/logos/round/HOOD.png",
  CRCLx: "/assets/logos/round/CRCL.png",
  GOOGLx: "/assets/logos/round/GOOGL.png",
  MSTRx: "/assets/logos/round/MSTR.png",
  SPCXx: "/assets/logos/round/SPCX.png",
};

export const poolsSection = {
  title: "Live Raydium Liquidity Pools",
  body: "Explore available pools with real-time metrics. Click any pool to invest directly on Raydium.",
  cardTitle: "IDLE / SOL Liquidity Pool",
  featuredLabel: "IDLE / SOL",
  metrics: { liquidity: "Liquidity USD", volume: "24h volume", txns: "24h txns", price: "Price" },
  loadPools: "Load Live Pools",
  openRaydium: "Open directly on Raydium",
  showChart: "Show chart",
  hideChart: "Hide chart",
  chartTitle: "IDLE price chart on DexScreener",
};
