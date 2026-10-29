// Shared site content — links, nav, footer, game library, roadmap.
// Source of truth: the live idlemine.io (assets/js/config.js v21 + SPEC.md).
import { IDLE_MINT, DEX_URL, RAYDIUM_POOLS, RAYDIUM_SWAP, SOLSCAN } from "@/lib/token";

export const links = {
  games: "https://games.idlemine.io",
  midearth: "https://app.midearth.ai",
  playStore: "https://play.google.com/store/apps/details?id=com.idel.idleminekling&hl=en_IN",
  dexscreener: DEX_URL,
  raydiumSwap: RAYDIUM_SWAP,
  raydiumPools: RAYDIUM_POOLS,
  solscan: SOLSCAN,
  email: "support@idlemine.io",
} as const;

export const contract = IDLE_MINT;

export type SocialKey = "x" | "telegram" | "instagram" | "youtube";
// Real profiles from the live site config (links.x / telegram / instagram / youtube).
export const socials: Array<{ key: SocialKey; label: string; href: string }> = [
  { key: "x", label: "X", href: "https://x.com/stringidlemine" },
  { key: "telegram", label: "Telegram", href: "https://t.me/stringidlemine" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/idlemine3.0" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@IDLEMINE_3.0" },
];

export const nav = {
  brand: "IdleMine",
  items: [
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Tokenomics", href: "/tokenomics" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Liquidity", href: "/liquidity" },
  ],
  play: { label: "Play now", href: links.games },
  buy: { label: "Get $IDLE", href: "/tokenomics#buy" },
};

export const footer = {
  tagline: "The token that powers play.",
  columns: [
    {
      title: "Ecosystem",
      links: [
        { label: "IdleMine Games", href: links.games },
        { label: "MidEarth", href: links.midearth },
        { label: "IdleMine app", href: links.playStore },
        { label: "Ecosystem page", href: "/ecosystem" },
      ],
    },
    {
      title: "Token",
      links: [
        { label: "Tokenomics", href: "/tokenomics" },
        { label: "How to buy", href: "/tokenomics#buy" },
        { label: "Buyback flywheel", href: "/tokenomics#flywheel" },
        { label: "Liquidity", href: "/liquidity" },
        { label: "DexScreener", href: DEX_URL },
        { label: "Raydium", href: RAYDIUM_SWAP },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Roadmap", href: "/roadmap" },
        { label: "Community", href: "/#community" },
        { label: "Contact", href: `mailto:${links.email}` },
      ],
    },
  ],
  contact: {
    email: links.email,
    address:
      "String Fintech HK Ltd., Flat/RM 606, 6/F Hollywood Centre, 77–91 Queen’s Road West, Sheung Wan, Hong Kong",
  },
  disclaimer: {
    lead: "Disclaimer.",
    body: "$IDLE is a utility token for use within the IdleMine ecosystem. It is not an investment, security or offer of any financial product, and nothing on this site is financial advice. Digital assets are volatile and you may lose some or all of what you spend. Rewards depend on gameplay results and are not guaranteed. Access may be restricted in some countries. Check the laws where you live before buying or using $IDLE.",
  },
  copyright: "© 2026 IdleMine. All rights reserved.",
  dataCredit: "Live market data from DexScreener",
};

/* ───────── Game library — the 24 games listed on the live site (config.js `games.list`) ───────── */
export type GameTag = "Puzzle" | "Instant" | "Board" | "Arcade" | "Cards" | "Table";
export type Game = { title: string; tag: GameTag; cover: string; url: string };

const g = (title: string, tag: GameTag, slug: string): Game => ({
  title,
  tag,
  cover: `/assets/img/games/${slug}.webp`,
  url: links.games,
});

export const games: Game[] = [
  g("Arrow Puzzle", "Puzzle", "arrow-puzzle"),
  g("Mines", "Instant", "mines"),
  g("Ludo", "Board", "ludo"),
  g("Crash", "Instant", "crash"),
  g("Fruit Ninja", "Arcade", "fruit-ninja"),
  g("Blackjack", "Cards", "blackjack"),
  g("Plinko", "Instant", "plinko"),
  g("Snake & Ladder", "Board", "snake-ladder"),
  g("Mafia Roulette", "Table", "mafia-roulette"),
  g("UNO", "Cards", "uno"),
  g("Limbo", "Instant", "limbo"),
  g("Tricky Cups", "Instant", "tricky-cups"),
  g("American Roulette", "Table", "american-roulette"),
  g("Coin Flip", "Instant", "coin-flip"),
  g("Three Card Poker", "Cards", "three-card-poker"),
  g("Rabbit 9x", "Instant", "rabbit-9x"),
  g("Sheep Battle", "Arcade", "sheep-battle"),
  g("Rummy", "Cards", "rummy"),
  g("Tic Tac Toe", "Board", "tic-tac-toe"),
  g("Domino Duel", "Board", "domino-duel"),
  g("Dice", "Instant", "dice"),
  g("Stack Tower", "Arcade", "stack-tower"),
  g("Snake Arcade", "Arcade", "snake-arcade"),
  g("Tetris", "Puzzle", "tetris"),
];

/**
 * "Games live" count. The live HTML ships "14" as a no-JS fallback, but its script replaces it
 * with the length of the game list — so the rendered live site shows this number.
 */
export const gamesLive = games.length;

/* ───────── Roadmap — config.js `roadmap` (hidden phases removed, {ticker} → $IDLE) ───────── */
export type RoadmapStatus = "done" | "live" | "next" | "future";
export const roadmapStatusLabel: Record<RoadmapStatus, string> = {
  done: "Done",
  live: "Live",
  next: "Next",
  future: "Future",
};
export type Milestone = { phase: number; status: RoadmapStatus; name: string; copy: string; date?: string; url?: string };

export const roadmap: Milestone[] = [
  {
    phase: 1,
    status: "done",
    name: "Origins",
    copy: "IdleMine launches as a mobile game in 2021.",
    date: "2021",
    url: links.playStore,
  },
  {
    phase: 2,
    status: "live",
    name: "Gaming platform",
    copy: "IdleMine Games goes live with $IDLE as its in-game currency.",
    url: links.games,
  },
  // Hidden on the live site (hidden: true): "Agentic arena — MidEarth alpha launches: AI agents compete
  // in Food Collector and Territory Control for $IDLE." TODO(client): confirm before showing.
  { phase: 3, status: "next", name: "Expansion", copy: "More games on IdleMine Games, and new ways to use $IDLE." },
  { phase: 4, status: "future", name: "Open ecosystem", copy: "New platforms plug into $IDLE." },
];

/* ───────── Per-page metadata ───────── */
export const SITE_URL = "https://idlemine.io";
