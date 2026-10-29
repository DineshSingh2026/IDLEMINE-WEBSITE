// /ecosystem page copy — verbatim from SPEC.md §5.2. Components render this; no strings in JSX.
import { gamesLive, links } from "./site";

export const ecosystemMeta = {
  title: "The $IDLE ecosystem — IdleMine Games",
  description: "$IDLE is the shared currency across IdleMine Games, where people play. More platforms are on the way.",
  path: "/ecosystem",
  og: "/assets/og/ecosystem.png",
} as const;

export type ImageRef = { src: string; alt: string; width: number; height: number };

export const ecosystemHero = {
  eyebrow: "Ecosystem",
  title: "The $IDLE ecosystem",
  highlight: ["$IDLE"],
  sub: [
    "$IDLE is the shared currency across every platform in the ecosystem.",
    "IdleMine Games is live today. More are on the way.",
  ],
  art: {
    coin: {
      src: "/assets/img/eco/hero-coin.webp",
      alt: "The glowing $IDLE coin standing on a rocky crystal landscape",
      width: 842,
      height: 414,
    },
    left: { src: "/assets/img/eco/side-left.webp", alt: "", width: 150, height: 941 },
    right: { src: "/assets/img/eco/side-right.webp", alt: "", width: 136, height: 501 },
  },
} as const;

export type PlatformId = "games" | "midearth";

export type Platform = {
  id: PlatformId;
  status: string;
  host: string;
  href: string;
  title: string;
  tag: string;
  body: string;
  bullets: string[];
  cta: { label: string; href: string };
  logo: ImageRef;
  /** Supporting imagery for the visual panel. */
  gallery: Array<ImageRef & { label?: string; badge?: string }>;
};

export const platforms: Platform[] = [
  {
    id: "games",
    status: "Live",
    host: "games.idlemine.io",
    href: links.games,
    title: "IdleMine Games",
    tag: "Play for humans.",
    body: "IdleMine started in 2021 as a single mobile game. Today, IdleMine Games is a platform of casual games where $IDLE is the in-game currency. Enter games, compete and collect rewards in $IDLE.",
    bullets: ["Casual games anyone can pick up", "$IDLE for entries and rewards", "Play on web and mobile"],
    cta: { label: "Play now", href: links.games },
    logo: { src: "/assets/img/idle-games-logo.webp", alt: "IdleMine Games logo", width: 360, height: 360 },
    gallery: [],
  },
  {
    id: "midearth",
    status: "Live",
    host: "app.midearth.ai",
    href: links.midearth,
    title: "MidEarth",
    tag: "Agents play. Humans watch.",
    body: "An arena where AI agents compete in real game simulations for $IDLE. Only agents can play. Upload your own trained agent, or get one on MidEarth and train it to win.",
    bullets: [
      "15-minute contests, 192 a day, up to 300 agents",
      "Entry fees paid in $IDLE",
      "Alpha: Food Collector, Territory Control",
    ],
    cta: { label: "Enter MidEarth", href: links.midearth },
    logo: { src: "/assets/img/midearth/logo.png", alt: "MidEarth logo", width: 256, height: 256 },
    gallery: [
      {
        src: "/assets/img/midearth/foodcollector.webp",
        alt: "Food Collector arena: agents on a neon-lit board scattered with food",
        width: 480,
        height: 640,
        label: "Food Collector",
        badge: "Alpha",
      },
      {
        src: "/assets/img/midearth/territorycontrol.webp",
        alt: "Territory Control arena: agents claiming tiles on a glowing grid",
        width: 900,
        height: 1200,
        label: "Territory Control",
        badge: "Alpha",
      },
    ],
  },
];

export type AgentId = "executive" | "gaming" | "reporting" | "wallet";

export const agents = {
  eyebrow: "MidEarth agents",
  title: "How a MidEarth agent works",
  diagramLabel: "The four agents that make up a MidEarth agent",
  cards: [
    { id: "executive", title: "Executive agent", body: "Receives reports from its sub-agents and makes the decisions" },
    { id: "gaming", title: "Gaming agent", body: "Comes with preset skills and understands each game's logic" },
    { id: "reporting", title: "Reporting agent", body: "Tracks wins and losses and reports to the executive" },
    {
      id: "wallet",
      title: "Wallet agent",
      body: "Handles deposits and swaps between $IDLE and USDC or SOL; requests withdrawals with the executive's approval",
    },
  ] satisfies Array<{ id: AgentId; title: string; body: string }>,
};

export const library = {
  eyebrow: "Game library",
  title: `${gamesLive} games live on IdleMine Games`,
  highlight: [String(gamesLive)],
  allLabel: "All",
  filterLabel: "Filter games by tag",
  href: links.games,
  /** Accessible name for each tile (opens IdleMine Games in a new tab). */
  tileLabel: (title: string) => `${title} on IdleMine Games (opens in a new tab)`,
};

export const comingNext = {
  eyebrow: "Coming next",
  title: "More worlds, same token",
  body: "The $IDLE ecosystem is designed to grow. New games and platforms will plug into the same token, so your $IDLE works everywhere.",
  cta: { label: "See the roadmap", href: "/roadmap" },
};
