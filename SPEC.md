# IDLEMINE.IO — REBUILD SPEC (page content + motion, verbatim from the client brief)

> Implementation notes from the lead (these override the brief where they conflict):
> - Package manager is **npm** (pnpm unavailable). Lenis package is `lenis` (the `@studio-freight/lenis` name is deprecated).
> - Shared content (links, socials, nav, footer, game library, roadmap) lives in `data/content/site.ts`, scraped from the live site's `config.js`. Social URLs are REAL (from live config), not `#`.
> - **Games live = `gamesLive` from site.ts (24)**. The live HTML has "14" only as a no-JS fallback; its JS replaces it with the game list length. Never hardcode 14 — interpolate `gamesLive`.
> - Live game list has tags: Puzzle · Instant · Board · Arcade · Cards · Table (use these, not the brief's 4 categories).
> - Roadmap = `roadmap` in site.ts (4 visible phases; statuses Done/Live/Next/Future exactly as the live site labels them).

Design: solana.com layout/motion language × IdleMine content. Dark only. Midnight navy + gold accent, violet→mint secondary gradient.

---

## 5.1 HOME `/`
title `$IDLE — The token powering IdleMine Games` · description `$IDLE powers IdleMine Games, where people play and collect rewards. Learn how to get $IDLE.` · OG `/assets/og/home.png`

### A — Live ticker band (above hero)
5 live stats, mono, 60s refresh, pulse on change: `$IDLE price` (price + 24h % arrow) · `Market cap` · `Total volume` · `24h trades` · `Games live`.
Right caption `Live market data from DexScreener ↗` → DexScreener.

### B — Hero
```
Eyebrow:  The $IDLE ecosystem
H1:       The token that powers play.
Sub:      $IDLE is the in-game currency across the IdleMine ecosystem. Play on IdleMine Games and collect rewards in $IDLE.
CTA 1 (primary):   Get $IDLE             → /tokenomics#buy
CTA 2 (secondary): Explore the ecosystem → /ecosystem
Visual: 3D $IDLE coin (R3F) — slow idle rotation, mouse-tilt, gold rim light, violet/mint fill light from below. Fallback: /assets/img/eco/hero-coin.webp (or a CSS coin) with CSS float.
Two-chip strip below hero:  "Humans play · {gamesLive} games"   "Agents compete · MidEarth"
```
Layout: left-aligned text (max-w 720px), coin right, full-bleed gradient background with grain.

### C — Promo card (like Solana's "Samsung Wallet + Solana" card)
```
Logo: /assets/img/idle-games-logo.webp
Title: Play on IdleMine Games   Badge: {gamesLive} games live
Body:  Puzzles, board games, cards and instant games — all with $IDLE entries and rewards.
Link:  Play now →   → https://games.idlemine.io
```

### D — MidEarth (AI agent arena)
```
Eyebrow: AI agent arena
H2:      Live in alpha on MidEarth
Body:    AI agents compete in real game simulations for $IDLE. Bring your own agent or get one on MidEarth and train it to win.
Logo tile: /assets/img/midearth/logo.png + wordmark "MIDEARTH"
Pill chips:  15-min contests  ·  192 a day  ·  Up to 300 agents
CTA: Enter MidEarth →  → https://app.midearth.ai
Two arena cards (image, "Alpha" badge, title, one-liner, whole card → https://app.midearth.ai):
  1. /assets/img/midearth/foodcollector.webp    — Food Collector — Agents race to collect the most food.
  2. /assets/img/midearth/territorycontrol.webp — Territory Control — Agents battle to claim the most tiles.
```

### E — Our Ecosystem (mobile games)
```
Eyebrow: Mobile games
H2:      Our Ecosystem
Body:    Immersive experiences designed to generate real yield through gameplay.
Logo tile: /assets/img/idlemine-mark.webp + "IDLEMINE"
Chips:  Free to play · Earn $IDLE · Android
Google Play badge → links.playStore
Two game cards (both → links.playStore):
  1. /assets/img/eco/idle-walk.webp  alt "A sneaker on a glowing step pad with gold coins" — Tag: Passive — Title: Idle Walk — Body: Earn while you sleep. Steps turn into yield. — Link: Explore Game
  2. /assets/img/eco/idle-thumb.webp alt "A thumbs-up hand surrounded by gold coins"      — Tag: Active  — Title: Idle Thumb — Body: Tap your way to active rewards. Compete globally. — Link: Explore Game
```

### F — Agentic economy (THE SHOWPIECE)
```
Eyebrow: Agentic economy
H2:      Built for an economy where AI agents play
Body 1:  On MidEarth, only agents can play. Each agent runs as a small team: an executive agent makes decisions, a gaming agent plays, a reporting agent tracks wins and losses, and a wallet agent handles $IDLE.
Body 2:  Your agent enters contests, plays, reports back and manages its own funds — with you in control of withdrawals.
CTA:     Enter MidEarth →  → https://app.midearth.ai
Diagram (4 nodes + 1 human node, animated connecting lines):
  Executive agent — Makes the decisions
  Gaming          — Plays the game
  Reporting       — Tracks wins and losses
  Wallet          — Handles $IDLE
  You             — stay in control of withdrawals   (rendered "**You** stay in control of withdrawals")
```
Motion: GSAP ScrollTrigger pins ~1.5 viewport heights; nodes light up Executive → Gaming → Reporting → Wallet → You, animated dashed line travels between them (SVG stroke-dashoffset). Mobile: unpinned vertical stack.

### G — Roadmap teaser
```
Eyebrow: Roadmap
H2:      Where $IDLE is going
Body:    From one game in 2021 to a growing ecosystem of games. See what's next.
CTA:     View roadmap → /roadmap
Background: /assets/img/eco/games-art.webp parallax art layer, 30% opacity, masked.
```

### H — Community / newsletter   (section id="community")
```
Eyebrow: Community
H2:      Join the $IDLE community
Body:    Get launch news, contest announcements and new game drops first.
Social buttons: X · Telegram · Instagram · YouTube   (real URLs from site.ts `socials`)
Email input + button "Notify me" → POST /api/subscribe {email}. Messages (live site):
  invalid → "Please enter a valid email address."   ok → "You're on the list. Watch your inbox for launch news."   error → "Something went wrong. Please try again."
```

---

## 5.2 ECOSYSTEM `/ecosystem`
title `The $IDLE ecosystem — IdleMine Games` · description `$IDLE is the shared currency across IdleMine Games, where people play. More platforms are on the way.` · OG `/assets/og/ecosystem.png`

```
Hero (decorated: side-left.webp pinned left, side-right.webp pinned right, hero-coin.webp centered & floating):
  Eyebrow: Ecosystem
  H1:      The $IDLE ecosystem
  Sub:     $IDLE is the shared currency across every platform in the ecosystem.
           IdleMine Games is live today. More are on the way.

Platform block 1 — status pill "Live" + mono link games.idlemine.io
  H2:  IdleMine Games
  Tag: Play for humans.
  Body: IdleMine started in 2021 as a single mobile game. Today, IdleMine Games is a platform of casual games where $IDLE is the in-game currency. Enter games, compete and collect rewards in $IDLE.
  Bullets: • Casual games anyone can pick up  • $IDLE for entries and rewards  • Play on web and mobile
  CTA: Play now → https://games.idlemine.io

Platform block 2 — status pill "Live" + mono link app.midearth.ai
  H2:  MidEarth
  Tag: Agents play. Humans watch.
  Body: An arena where AI agents compete in real game simulations for $IDLE. Only agents can play. Upload your own trained agent, or get one on MidEarth and train it to win.
  Bullets: • 15-minute contests, 192 a day, up to 300 agents  • Entry fees paid in $IDLE  • Alpha: Food Collector, Territory Control
  CTA: Enter MidEarth → https://app.midearth.ai

Section — MidEarth agents
  Eyebrow: MidEarth agents
  H2: How a MidEarth agent works
  4 cards:
    Executive agent — Receives reports from its sub-agents and makes the decisions
    Gaming agent    — Comes with preset skills and understands each game's logic
    Reporting agent — Tracks wins and losses and reports to the executive
    Wallet agent    — Handles deposits and swaps between $IDLE and USDC or SOL; requests withdrawals with the executive's approval

Section — Game library
  Eyebrow: Game library
  H2: {gamesLive} games live on IdleMine Games
  Grid of all games from site.ts `games` (cover, name, tag chip) with tag filter (All + each tag). Every tile → games.idlemine.io.

Section — Coming next
  Eyebrow: Coming next
  H2: More worlds, same token
  Body: The $IDLE ecosystem is designed to grow. New games and platforms will plug into the same token, so your $IDLE works everywhere.
  CTA: See the roadmap → /roadmap
```

---

## 5.3 TOKENOMICS `/tokenomics`
title `$IDLE tokenomics — economic ownership, utility and how to buy` · description `IDLE is economic ownership in the IdleMine ecosystem: a claim on platform fees, card volume, creator settlement and DeFi yield. See live price, utility, the buyback flywheel and how to buy on Raydium.` · theme color/canvas `#07061F` (bg-bg-deep) · OG `/assets/og/tokenomics.png`

```
Hero:
  Eyebrow: Tokenomics
  H1:      IDLE is Economic Ownership
  Kicker (italic, text-ink-3): This is not a meme. This is not governance fluff.
  Sub:     The utility token for games across the IdleMine ecosystem, backed by platform revenue and market buybacks.
  CTA 1: How to buy → #buy      CTA 2: Buyback flywheel → #flywheel
  Visual: /assets/img/idlemine-mark.png large, with gold glow

"Token at a glance" data card (2-col definition table, mono values, copy on address):
  Name                IdleMine
  Ticker              $IDLE
  Chain               Solana  (with Solana logo)
  Contract address    BjcRmwm8e25RgjkyaFE56fc7bxRgGPw96JUkXRJFEroT  (mono, truncated on mobile, copy button, "View on Solscan ↗")
  Price               live · 24h change
  Market cap          live  (label "live")
  Total supply        from FDV / price  (label "from FDV")
  Circulating supply  live

Section — Utility
  Eyebrow: Utility
  H2: One token across every platform
  5 cards (icon + H3 + body):
    Game entries     — Pay entry fees on IdleMine Games in $IDLE.
    Rewards          — Winnings on IdleMine Games are paid in $IDLE.
    Agents           — Get and run AI agents on MidEarth; each agent holds and manages $IDLE through its wallet agent.
    Swaps            — Agent wallets move between $IDLE and USDC or SOL.
    Future platforms — Every new game or platform in the ecosystem uses $IDLE.

Section — How it flows
  Eyebrow: How it flows
  H2: How $IDLE flows
  Body: Players acquire $IDLE, use it to enter games, and receive rewards in $IDLE.
  Animated circular SVG diagram, 3 numbered stops with a travelling particle around the loop:
    1 · Get $IDLE          (node label: Players buy and play)
    2 · Pay entry fees     (node label: IdleMine Games game entries)
    3 · Win rewards in $IDLE
  Caption: Players spend $IDLE on entries and receive rewards in $IDLE.
  aria-label: "How $IDLE flows: players get $IDLE, pay entry fees on IdleMine Games and win rewards in $IDLE."

Section — Flywheel  id="flywheel"
  H2: Revenue to Buyback Flywheel
  Lead: This is the core economic engine of IdleMine.
  Sub-block "Each Cycle":
    The platform earns revenue in USDC from in-game purchases, card payments, FX payments, settlement fees, and DeFi yield.
    All revenue flows into the protocol treasury. The treasury uses a portion of this revenue to **buy IDLE tokens directly from the open market.**
  Sub-block "Purchased tokens are:":
    • Burned to reduce circulating supply  OR
    • Distributed to stakers as rewards
    Creates continuous demand, supply reduction, and long-term price support.
  Horizontal pipeline diagram (GSAP scrub, each stage lights as you scroll; mobile stacks vertically):
    REVENUE → TREASURY → MARKET BUYBACKS → BURN / STAKE → INCREASED SCARCITY → STRONGER ECONOMY

Section — Why This Matters (two-column contrast)
  H2: Why This Matters
  Left card (muted, red-tinted border) "Most play-to-earn games":  • Print tokens  • Dump rewards  • Collapse
  Right card (gold-tinted border) "IdleMine instead":  • Generates real revenue  • Buys tokens from market  • Reduces supply  • Rewards long-term holders
  Closing line (Display S): This is how sustainable GameFi is built.

Section — How to buy  id="buy"
  Eyebrow: How to buy
  H2: How to buy $IDLE
  Body: Four steps from an empty wallet to your first match.
  Callout (warning): **Always check the contract address.** The only official $IDLE contract is BjcRmwm8e25RgjkyaFE56fc7bxRgGPw96JUkXRJFEroT.
  4 steps (Stepper, logos inline):
    1. Set up a wallet — Install a Solana-compatible wallet such as Phantom or Solflare.   [Phantom + Solflare logos]
    2. Fund it — Add SOL to your wallet.   [Solana logo]
    3. Swap for $IDLE — Use Raydium and paste the official contract address to avoid fake tokens.   [Raydium logo; button "Swap on Raydium ↗" → RAYDIUM_SWAP]
    4. Start playing — Connect your wallet on IdleMine Games.   → https://games.idlemine.io

Closing CTA band:
  H2: Play. Earn. Own.
  CTA 1 (primary): Play Now → links.playStore
  CTA 2 (secondary): Liquidity → /liquidity
```

---

## 5.4 ROADMAP `/roadmap`
title `Roadmap — The road for $IDLE` · description `From one mobile game in 2021 to a growing ecosystem of games. See the phases ahead for $IDLE.` · OG `/assets/og/roadmap.png` · OG title on live site: `The road for $IDLE`
```
Hero (background /assets/img/eco/games-art.webp, parallax, dark gradient mask):
  Eyebrow: Roadmap
  H1:      The road for $IDLE      ($IDLE in gold gradient)
  Sub:     From one game in 2021 to a growing ecosystem of games.
Timeline — data from site.ts `roadmap`. "Phase N" + status label. Vertical on mobile; horizontal scrubbed GSAP-pinned rail on desktop (like Solana's event rail).
Status chips: Done (mint) · Live (gold, pulsing dot) · Next / Future (text-ink-3 outline). A milestone with `url` links out.
```

---

## 5.5 LIQUIDITY `/liquidity`
title `Liquidity pools — earn yield on IDLE / SOL` · description `Provide liquidity, earn yield, and keep full custody of your assets through Raydium liquidity pools, including IDLE / SOL and tokenized real-world assets.` · canvas `#07061F` · OG `/assets/og/liquidity.png`
```
Live ticker band (TickerBand, fields): $IDLE price · Total liquidity · Total volume · Pools (live count)
Hero:
  Eyebrow: Liquidity
  H1:      Liquidity Pools
  Sub:     Provide liquidity, earn yield, and maintain full custody of assets. Gain exposure to tokenized real-world assets through Raydium liquidity pools with no intermediaries.
  Asset rail (logo + name + ticker, looping marquee): Tesla TSLAx · Gold GLDx · Nvidia NVDAx · QQQ QQQx · Coinbase COINx · Robinhood HOODx
  Three trust chips: No intermediaries · Competitive APY · Full asset control
  Visual: /assets/img/idlemine-logo.png
Section — Pools
  H2: Live Raydium Liquidity Pools
  Body: Explore available pools with real-time metrics. Click any pool to invest directly on Raydium.
  Pool card: H3 "IDLE / SOL Liquidity Pool"; live metrics Liquidity USD · 24h volume · 24h txns · Price
  Buttons: "Load Live Pools" (renders the stats.pools list) · "Open directly on Raydium ↗" → RAYDIUM_POOLS
  DexScreener chart iframe DEX_EMBED, lazy, behind a "Show chart" toggle.
```

---

## 7. MOTION SPEC (calm, confident, no bounce)
- Lenis is already wired (components/layout/SmoothScroll.tsx) and drives GSAP's ticker. Use `ScrollTrigger` from `gsap/ScrollTrigger` (already registered).
- Easing `cubic-bezier(0.22,1,0.36,1)` (`EASE` export / `ease-quint` class). Durations 0.6–0.9s. Stagger 60–90ms.
- Every section reveals eyebrow → heading → body → CTA → cards (opacity 0→1, y 24→0, once, amount 0.25).
- Headings: `<Heading>` already does word-level stagger.
- Cards: `<Card>` already does hover lift + cursor gold glow.
- Pinned sequences (Agentic economy, Flywheel, Roadmap rail): ScrollTrigger `scrub: 0.8`, `pin: true`; mobile (<1024) → unpinned vertical stack. Use `gsap.matchMedia()` and clean up (`ctx.revert()`) on unmount.
- `prefers-reduced-motion`: no pins/scrub/parallax/3D/count-ups; opacity only. Framer honours this via MotionConfig already; GSAP code must check it.
- Only the hero coin, marquees and the "in progress/live" pulse dot animate forever.

## 9. QUALITY BAR
- One `<h1>` per page. Semantic landmarks. Diagrams have aria-label/<desc>. Icons aria-hidden.
- Hero text server-rendered and visible pre-JS. CLS 0. `next/image` with correct `sizes`.
- Every external link: new tab + `rel="noopener noreferrer"` (Button / SmartLink do this automatically).
- No placeholders, no lorem ipsum, no fabricated stats/games/milestones.
- Contract address identical everywhere (always import `contract`/`IDLE_MINT`, never retype it).
- 360px width: nothing overflows, no horizontal scroll.
