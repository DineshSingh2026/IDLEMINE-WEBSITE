// Home page content — VERBATIM from "idlemine.io Website Revamp — Design Brief" (Oct 29, 2026, @Ganesh).
// Items the brief marks [LINK NEEDED] / [ANSWER NEEDED] are flagged `todo` and handled as noted.
import { RAYDIUM_POOLS, DEX_URL, IDLE_MINT } from "@/lib/token";

/** Raydium swap for $IDLE (from the live site config). Brief: "Get $IDLE" + "IDLE Raydium Token" use this. */
export const RAYDIUM_SWAP_SOL = `https://raydium.io/swap/?inputMint=sol&outputMint=${IDLE_MINT}`;
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.idel.idleminekling&hl=en_IN";
export const IDLE_GAMES = "https://games.idlemine.io";
/** TODO(client): brief says [LINK NEEDED] for Agent Games — using the live site's AI-agent arena. Confirm. */
export const AGENT_GAMES = "https://app.midearth.ai";

export type MenuItem = {
  label: string;
  href?: string; // absent → not clickable
  soon?: boolean; // greyed out + "Coming Soon" badge
  todo?: string;
  desc?: string;
};

/* ───────── 1. Header / navigation ───────── */
export const header = {
  menus: [
    {
      label: "Use $IDLE",
      items: [
        { label: "IDLE Token Info", href: DEX_URL, desc: "Live chart on DexScreener" },
        { label: "IDLE Raydium Token", href: RAYDIUM_SWAP_SOL, desc: "Swap SOL for $IDLE on Raydium" },
        { label: "IDLE Raydium Liquidity Pools", href: RAYDIUM_POOLS, desc: "Provide liquidity and earn" },
      ] as MenuItem[],
    },
    {
      label: "Products",
      items: [
        { label: "Idlemine", href: PLAY_STORE, desc: "The original mobile game" },
        { label: "Idle Games", href: IDLE_GAMES, desc: "Casual games with $IDLE" },
        { label: "Agent Games", href: AGENT_GAMES, desc: "AI agents compete for $IDLE", todo: "confirm link" },
        // TODO(client): brief says [LINK NEEDED] — rendered as Coming Soon until a link exists.
        { label: "Bills on Chain", soon: true, todo: "link needed" },
        { label: "Prediction Markets for Agents", soon: true },
        { label: "Gaming for AI Agents", soon: true },
      ] as MenuItem[],
    },
  ],
  /** No dropdown — smooth-scrolls to the RWA section. */
  rwa: { label: "Real World Assets", href: "/#rwa" },
  cta: { label: "Get $IDLE", href: RAYDIUM_SWAP_SOL },
};

/* ───────── 2. Hero ───────── */
export const hero = {
  title: "$IDLE powers the human and Agentic Economies",
  body: "$IDLE is the token powering human and AI economies. Every transaction across gaming and the agentic economy runs on $IDLE, whether a player is earning rewards or an AI agent is competing, transacting, and settling value on its own.",
  primary: { label: "Get $IDLE", href: RAYDIUM_SWAP_SOL },
  secondary: { label: "Explore the ecosystem", href: "#ecosystem" },
};

/* ───────── 3. Stats ───────── */
export const stats = {
  title: "The Fastest Growing & Leading Gaming Token on Blockchain",
  items: [
    { label: "Total Users Across $IDLE Ecosystem", value: 5664370, format: "int" },
    { label: "Total Transactions", value: 11350677, format: "int" },
    { label: "Trading Volume", value: 200, format: "millions" }, // "$200 Million"
    { label: "Real World Assets Paired with $IDLE", value: 14, format: "int" },
    { label: "Total Fees Paid to Liquidity Providers", value: 750000, format: "usd" }, // "$750,000"
  ] as const,
  // TODO(client): brief says "Data as of [DATE]" — set to the brief's date; confirm.
  source: "Data as of 29 Oct 2026 · Sources: DexScreener, Raydium, IdleMine platforms",
};

/* ───────── 4. Ecosystem ───────── */
export const ecosystem = {
  id: "ecosystem",
  title: "Explore $IDLE across Human & AI Economies",
  products: [
    {
      name: "Idlemine",
      audience: "Humans",
      body: "The original IdleMine mobile game. Play, earn and collect $IDLE on Android.",
      cta: { label: "Get it on Google Play", href: PLAY_STORE },
      // Real IdleMine game art (live site). TODO(client): brief says [ASSETS NEEDED] — swap when supplied.
      images: ["/assets/img/eco/idle-thumb.webp", "/assets/img/eco/idle-walk.webp"],
      tone: "mint",
    },
    {
      name: "Idle Games",
      audience: "Humans",
      body: "Puzzles, board games, cards and instant games, with $IDLE entries and rewards.",
      cta: { label: "Play now", href: IDLE_GAMES },
      images: ["/assets/img/idle-games-logo.webp"],
      tone: "mint",
    },
    {
      name: "Agent Games",
      audience: "AI agents",
      body: "AI agents compete in live game contests and win $IDLE.",
      cta: { label: "Enter", href: AGENT_GAMES },
      images: ["/assets/img/midearth/territorycontrol.webp", "/assets/img/midearth/foodcollector.webp"],
      tone: "violet",
    },
  ],
};

/* ───────── 5. Real World Assets x $IDLE ───────── */
export const rwa = {
  id: "rwa",
  title: "Powering Real World Assets with $IDLE",
  body: "Provide Liquidity for Real World Assets and $IDLE to Earn Yield",
  // Official xStocks (Backed Finance) token logos, already in /public/assets/logos.
  assets: [
    { name: "Tesla", ticker: "TSLA", logo: "/assets/logos/TSLAx.png" },
    { name: "NVIDIA", ticker: "NVDA", logo: "/assets/logos/NVDAx.png" },
    { name: "Coinbase", ticker: "COIN", logo: "/assets/logos/COINx.png" },
    { name: "Circle", ticker: "CRCL", logo: "/assets/logos/CRCLx.png" },
    { name: "Strategy", ticker: "MSTR", logo: "/assets/logos/MSTRx.png" },
    { name: "Robinhood", ticker: "HOOD", logo: "/assets/logos/HOODx.png" },
    { name: "Gold", ticker: "GLDX", logo: "/assets/logos/GLDx.png" },
  ],
  pairSuffix: " / IDLE",
  cta: { label: "View more", href: RAYDIUM_POOLS },
  // TODO(legal): brief asks legal to confirm this wording.
  note: "Tokens shown are tokenized versions of these assets. They are not issued by, affiliated with or endorsed by the companies shown.",
};

/* ───────── 6. FAQs ───────── */
export type Faq = { q: string; a: string; contract?: boolean };
export const faqs: Faq[] = [
  {
    q: "What is $IDLE?",
    a: "The token powering the human and agentic economies across the IdleMine ecosystem: games for players and arenas for AI agents.",
  },
  { q: "Which blockchain is $IDLE on?", a: "Solana." },
  {
    q: "How do I buy $IDLE?",
    a: "Set up a Solana wallet, add SOL, and swap for $IDLE on Raydium using the official contract address.",
  },
  // Brief: [CONFIRM] — this is the address in the DexScreener/Raydium links.
  { q: "What is the official contract address?", a: "", contract: true },
  {
    q: "Where can I use $IDLE?",
    a: "Idlemine, Idle Games and Agent Games today, with Bills on Chain and more coming.",
  },
  // TODO(client): brief says [ANSWER NEEDED] — drafted from the live site's MidEarth copy.
  {
    q: "What are Agent Games?",
    a: "Games where only AI agents play. Agents compete in live game contests and win $IDLE. Bring your own agent or get one, train it to win, and watch it compete.",
  },
  // TODO(legal): brief says [ADD RISK NOTE] — draft risk note, confirm wording.
  {
    q: "How do I earn yield with Real World Assets?",
    a: "By providing liquidity to RWA / $IDLE pools on Raydium. Providing liquidity carries risk, including impermanent loss and price volatility, and you may lose some or all of what you deposit. Yields are not guaranteed.",
  },
  // TODO(client): "Who is behind $IDLE?" is [ANSWER NEEDED] in the brief — hidden until the team confirms the entity.
];

/* ───────── 7. Footer ───────── */
export const footerCols = [
  {
    title: "Use $IDLE",
    links: [
      { label: "Token Info", href: DEX_URL },
      { label: "Raydium Token", href: RAYDIUM_SWAP_SOL },
      { label: "Liquidity Pools", href: RAYDIUM_POOLS },
    ] as MenuItem[],
  },
  {
    title: "Products",
    links: [
      { label: "Idlemine", href: PLAY_STORE },
      { label: "Idle Games", href: IDLE_GAMES },
      { label: "Agent Games", href: AGENT_GAMES },
      { label: "Bills on Chain", soon: true },
      { label: "Prediction Markets for Agents", soon: true },
      { label: "Gaming for AI Agents", soon: true },
    ] as MenuItem[],
  },
  {
    title: "Real World Assets",
    links: [
      { label: "RWA section", href: "/#rwa" },
      { label: "Raydium Liquidity Pools", href: RAYDIUM_POOLS },
    ] as MenuItem[],
  },
];
/** Live idlemine.io legal pages (they exist today). */
export const legal = [
  { label: "Terms", href: "https://idlemine.io/terms.html" },
  { label: "Privacy Policy", href: "https://idlemine.io/privacy.html" },
  { label: "Risk Disclaimer", href: "https://idlemine.io/disclaimer.html" },
];
