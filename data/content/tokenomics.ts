// /tokenomics copy — verbatim from SPEC §5.3. Never retype the contract address: import `contract`.
import { contract, links } from "./site";
import { RAYDIUM_SWAP, SOLSCAN } from "@/lib/token";

export const tokenomicsMeta = {
  title: "$IDLE tokenomics · economic ownership, utility and how to buy",
  description:
    "IDLE is economic ownership in the IdleMine ecosystem: a claim on platform fees, card volume, creator settlement and DeFi yield. See live price, utility, the buyback flywheel and how to buy on Raydium.",
  path: "/tokenomics",
  og: "/assets/og/tokenomics.png",
};

export const hero = {
  eyebrow: "Tokenomics",
  title: "IDLE is Economic Ownership",
  kicker: "This is not a meme. This is not governance fluff.",
  sub: "The utility token for games across the IdleMine ecosystem, backed by platform revenue and market buybacks.",
  ctas: [
    { label: "How to buy", href: "#buy" },
    { label: "Buyback flywheel", href: "#flywheel" },
  ],
  mark: { src: "/assets/img/idlemine-mark.png", alt: "IdleMine $IDLE token mark" },
};

export const glance = {
  title: "Token at a glance",
  rows: {
    name: { label: "Name", value: "IdleMine" },
    ticker: { label: "Ticker", value: "$IDLE" },
    chain: { label: "Chain", value: "Solana" },
    contract: { label: "Contract address", value: contract },
    price: { label: "Price", note: "live" },
    marketCap: { label: "Market cap", note: "live" },
    totalSupply: { label: "Total supply", note: "from FDV" },
    circulating: { label: "Circulating supply", note: "live" },
  },
  solscan: { label: "View on Solscan", href: SOLSCAN },
};

export type UtilityKey = "entries" | "rewards" | "agents" | "swaps" | "future";
export const utility = {
  eyebrow: "Utility",
  title: "One token across every platform",
  cards: [
    { key: "entries", title: "Game entries", body: "Pay entry fees on IdleMine Games in $IDLE." },
    { key: "rewards", title: "Rewards", body: "Winnings on IdleMine Games are paid in $IDLE." },
    {
      key: "agents",
      title: "Agents",
      body: "Get and run AI agents on MidEarth; each agent holds and manages $IDLE through its wallet agent.",
    },
    { key: "swaps", title: "Swaps", body: "Agent wallets move between $IDLE and USDC or SOL." },
    { key: "future", title: "Future platforms", body: "Every new game or platform in the ecosystem uses $IDLE." },
  ] satisfies Array<{ key: UtilityKey; title: string; body: string }>,
};

export const flow = {
  eyebrow: "How it flows",
  title: "How $IDLE flows",
  body: "Players acquire $IDLE, use it to enter games, and receive rewards in $IDLE.",
  stops: [
    { n: 1, title: "Get $IDLE", label: "Players buy and play" },
    { n: 2, title: "Pay entry fees", label: "IdleMine Games game entries" },
    { n: 3, title: "Win rewards in $IDLE", label: null },
  ],
  caption: "Players spend $IDLE on entries and receive rewards in $IDLE.",
  ariaLabel: "How $IDLE flows: players get $IDLE, pay entry fees on IdleMine Games and win rewards in $IDLE.",
};

export type StageKey = "revenue" | "treasury" | "buybacks" | "burn" | "scarcity" | "economy";
export const flywheel = {
  id: "flywheel",
  title: "Revenue to Buyback Flywheel",
  lead: "This is the core economic engine of IdleMine.",
  cycle: {
    title: "Each Cycle",
    p1: "The platform earns revenue in USDC from in-game purchases, card payments, FX payments, settlement fees, and DeFi yield.",
    p2: "All revenue flows into the protocol treasury. The treasury uses a portion of this revenue to",
    p2Strong: "buy IDLE tokens directly from the open market.",
  },
  purchased: {
    title: "Purchased tokens are:",
    options: ["Burned to reduce circulating supply", "Distributed to stakers as rewards"],
    or: "OR",
    result: "Creates continuous demand, supply reduction, and long-term price support.",
  },
  stages: [
    { key: "revenue", label: "REVENUE" },
    { key: "treasury", label: "TREASURY" },
    { key: "buybacks", label: "MARKET BUYBACKS" },
    { key: "burn", label: "BURN / STAKE" },
    { key: "scarcity", label: "INCREASED SCARCITY" },
    { key: "economy", label: "STRONGER ECONOMY" },
  ] satisfies Array<{ key: StageKey; label: string }>,
};

export const why = {
  title: "Why This Matters",
  bad: { title: "Most play-to-earn games", items: ["Print tokens", "Dump rewards", "Collapse"] },
  good: {
    title: "IdleMine instead",
    items: ["Generates real revenue", "Buys tokens from market", "Reduces supply", "Rewards long-term holders"],
  },
  closing: "This is how sustainable GameFi is built.",
};

export const buy = {
  id: "buy",
  eyebrow: "How to buy",
  title: "How to buy $IDLE",
  body: "Four steps from an empty wallet to your first match.",
  callout: {
    strong: "Always check the contract address.",
    text: "The only official $IDLE contract is",
    address: contract,
  },
  steps: [
    {
      title: "Set up a wallet",
      body: "Install a Solana-compatible wallet such as Phantom or Solflare.",
      logos: [
        { name: "Phantom", src: "/assets/logos/phantom.svg" },
        { name: "Solflare", src: "/assets/logos/solflare.svg" },
      ],
    },
    {
      title: "Fund it",
      body: "Add SOL to your wallet.",
      logos: [{ name: "Solana", src: "/assets/logos/solana.svg" }],
    },
    {
      title: "Swap for $IDLE",
      body: "Use Raydium and paste the official contract address to avoid fake tokens.",
      logos: [{ name: "Raydium", src: "/assets/logos/raydium.svg" }],
      cta: { label: "Swap on Raydium", href: RAYDIUM_SWAP },
    },
    {
      title: "Start playing",
      body: "Connect your wallet on IdleMine Games.",
      logos: [],
      cta: { label: "IdleMine Games", href: links.games },
    },
  ],
};

export const closing = {
  title: "Play. Earn. Own.",
  ctas: [
    { label: "Play Now", href: links.playStore, variant: "primary" as const },
    { label: "Liquidity", href: "/liquidity", variant: "secondary" as const },
  ],
};

export const logos = {
  solana: "/assets/logos/solana.svg",
  usdc: "/assets/logos/usdc.png",
  raydium: "/assets/logos/raydium.svg",
};
