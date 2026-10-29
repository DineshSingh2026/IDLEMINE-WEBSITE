// Home page copy — verbatim from SPEC §5.1. No strings live in JSX.
import { gamesLive, links } from "./site";
import type { TickerField } from "@/components/home/TickerBand";

export type CTA = { label: string; href: string };

export const homeMeta = {
  title: "$IDLE — The token powering IdleMine Games",
  description: "$IDLE powers IdleMine Games, where people play and collect rewards. Learn how to get $IDLE.",
  path: "/",
  og: "/assets/og/home.png",
} as const;

/* A — Live ticker band */
export const tickerFields: TickerField[] = [
  { label: "$IDLE price", key: "priceUsd", format: "price", change: true },
  { label: "Market cap", key: "marketCap", format: "usd" },
  { label: "Total volume", key: "totalVolume", format: "usd" },
  { label: "24h trades", key: "txns24h", format: "int" },
  { label: "Games live", fixed: gamesLive, format: "int" },
];

/* B — Hero */
export const hero = {
  eyebrow: "The $IDLE ecosystem",
  title: "The token that powers play.",
  /** Words in the H1 rendered in the gold gradient. */
  titleHighlight: ["play."],
  sub: "$IDLE is the in-game currency across the IdleMine ecosystem. Play on IdleMine Games and collect rewards in $IDLE.",
  primary: { label: "Get $IDLE", href: "/tokenomics#buy" } satisfies CTA,
  secondary: { label: "Explore the ecosystem", href: "/ecosystem" } satisfies CTA,
  chips: [
    { lead: "Humans play", detail: `${gamesLive} games`, tone: "gold" as const },
    { lead: "Agents compete", detail: "MidEarth", tone: "mint" as const },
  ],
};

/* C — Promo card */
export const promo = {
  logo: "/assets/img/idle-games-logo.webp",
  logoAlt: "IdleMine Games logo",
  title: "Play on IdleMine Games",
  badge: `${gamesLive} games live`,
  body: "Puzzles, board games, cards and instant games — all with $IDLE entries and rewards.",
  link: { label: "Play now", href: links.games } satisfies CTA,
};

/* D — MidEarth */
export const midearth = {
  eyebrow: "AI agent arena",
  title: "Live in alpha on MidEarth",
  body: "AI agents compete in real game simulations for $IDLE. Bring your own agent or get one on MidEarth and train it to win.",
  logo: "/assets/img/midearth/logo.png",
  wordmark: "MIDEARTH",
  chips: ["15-min contests", "192 a day", "Up to 300 agents"],
  cta: { label: "Enter MidEarth", href: links.midearth } satisfies CTA,
  badge: "Alpha",
  arenas: [
    {
      image: "/assets/img/midearth/foodcollector.webp",
      alt: "Food Collector arena: two agents on a glowing board scattered with food",
      title: "Food Collector",
      body: "Agents race to collect the most food.",
      href: links.midearth,
    },
    {
      image: "/assets/img/midearth/territorycontrol.webp",
      alt: "Territory Control arena: agents claiming coloured tiles on a neon board",
      title: "Territory Control",
      body: "Agents battle to claim the most tiles.",
      href: links.midearth,
    },
  ],
};

/* E — Our Ecosystem */
export const ecosystem = {
  eyebrow: "Mobile games",
  title: "Our Ecosystem",
  body: "Immersive experiences designed to generate real yield through gameplay.",
  logo: "/assets/img/idlemine-mark.webp",
  wordmark: "IDLEMINE",
  chips: ["Free to play", "Earn $IDLE", "Android"],
  playStore: {
    href: links.playStore,
    badge: "/assets/logos/google-play-badge.png",
    alt: "Get it on Google Play",
  },
  games: [
    {
      image: "/assets/img/eco/idle-walk.webp",
      alt: "A sneaker on a glowing step pad with gold coins",
      tag: "Passive",
      title: "Idle Walk",
      body: "Earn while you sleep. Steps turn into yield.",
      link: "Explore Game",
      href: links.playStore,
    },
    {
      image: "/assets/img/eco/idle-thumb.webp",
      alt: "A thumbs-up hand surrounded by gold coins",
      tag: "Active",
      title: "Idle Thumb",
      body: "Tap your way to active rewards. Compete globally.",
      link: "Explore Game",
      href: links.playStore,
    },
  ],
};

/* F — Agentic economy */
export type AgentNodeId = "executive" | "gaming" | "reporting" | "wallet" | "you";
export const agentic = {
  eyebrow: "Agentic economy",
  title: "Built for an economy where AI agents play",
  body1:
    "On MidEarth, only agents can play. Each agent runs as a small team: an executive agent makes decisions, a gaming agent plays, a reporting agent tracks wins and losses, and a wallet agent handles $IDLE.",
  body2:
    "Your agent enters contests, plays, reports back and manages its own funds — with you in control of withdrawals.",
  cta: { label: "Enter MidEarth", href: links.midearth } satisfies CTA,
  nodes: [
    { id: "executive", title: "Executive agent", body: "Makes the decisions" },
    { id: "gaming", title: "Gaming", body: "Plays the game" },
    { id: "reporting", title: "Reporting", body: "Tracks wins and losses" },
    { id: "wallet", title: "Wallet", body: "Handles $IDLE" },
    { id: "you", title: "You", body: "stay in control of withdrawals" },
  ] satisfies Array<{ id: AgentNodeId; title: string; body: string }>,
  diagramLabel:
    "MidEarth agent diagram: the executive agent makes the decisions; the gaming agent plays the game; the reporting agent tracks wins and losses; the wallet agent handles $IDLE; and you stay in control of withdrawals.",
};

/* G — Roadmap teaser */
export const roadmapTeaser = {
  eyebrow: "Roadmap",
  title: "Where $IDLE is going",
  body: "From one game in 2021 to a growing ecosystem of games. See what's next.",
  cta: { label: "View roadmap", href: "/roadmap" } satisfies CTA,
  art: "/assets/img/eco/games-art.webp",
  phaseLabel: "Phase",
};

/* H — Community */
export const community = {
  id: "community",
  eyebrow: "Community",
  title: "Join the $IDLE community",
  body: "Get launch news, contest announcements and new game drops first.",
  form: {
    label: "Email address",
    placeholder: "you@example.com",
    button: "Notify me",
    messages: {
      invalid: "Please enter a valid email address.",
      ok: "You're on the list. Watch your inbox for launch news.",
      error: "Something went wrong. Please try again.",
    },
  },
};
