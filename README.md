# idlemine.io: the $IDLE website

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP · Lenis.
The design follows the client's **$IDLE Design System v1**, Design Brief and token file. See `DESIGN.md`.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3333
npm run build && npm start
```

## Deploy on Vercel

1. Import this GitHub repo in Vercel. It detects the framework as Next.js.
2. Leave the build command (`next build`) and output settings at their defaults.
3. No environment variables are needed. Live market data comes from public APIs (DexScreener, CoinGecko).
4. Point the `idlemine.io` domain at the project.

## Home page (order set by the Design Brief)

Header with dropdowns → Hero (WebGL particle $IDLE mark) → Stats (live counters) → Products → Real World Assets x $IDLE (`#rwa`) → FAQs → closing CTA → Footer.

All copy, links and figures live in `data/content/landing.ts`.

## Live data

- `GET /api/token` serves DexScreener data for the $IDLE mint, cached for 15s and refreshed by the client every 15s.
  - Price comes from the deepest pool. Volume, liquidity and trades are summed across all pools.
- **Total transactions** and **trading volume** tick every second from real values.
  - Each starts from a real total (the brief's 11,350,677 transactions; the live running volume total).
  - Each then grows at DexScreener's real 24h rate.
- Users, RWA pairs and LP fees are the brief's static figures. No real rate exists for them, so they don't tick.

## Scripts

| Command | Purpose |
|---|---|
| `npm run fetch-assets` | Re-download the first-party images from idlemine.io |
| `node scripts/make-og.mjs` | Render the 1200×630 social cards and touch icons |
| `node scripts/round-tokens.mjs` | Turn the xStocks logos into clean circular tokens (`public/assets/logos/round/`) |
| `node scripts/shot.mjs / 1440` · `node scripts/tour.mjs / 390` | Visual QA screenshots (uses the installed Edge) |

## Open items for the client (from the Design Brief)

- [ ] **Agent Games link:** currently app.midearth.ai. Confirm.
- [ ] **Bills on Chain link:** shown as "Coming Soon" until supplied.
- [ ] **FAQs:**
  - "Who is behind $IDLE?" is hidden. The live site says String Fintech HK Ltd.; the brief suggests String Metaverse Limited. Confirm.
  - The "What are Agent Games?" answer and the RWA risk note are drafts for legal.
- [ ] **RWA legal note:** confirm the "not affiliated with or endorsed by" wording and get sign-off on logo use.
- [ ] **Stats:**
  - The "Data as of" date is set to 29 Oct 2026. Confirm.
  - Provide a real **new users per day** figure if Total Users should tick live.
- [ ] **Assets:** product imagery and SVG $IDLE logo files (the current art is from the live site).
- [ ] **Old pages:** `/tokenomics`, `/ecosystem`, `/roadmap` and `/liquidity` still exist (rebranded) but aren't in the brief's navigation. Keep or remove.

## Note for local development on this machine

The project folder name ends with an apostrophe (`29th oct'`). Next.js pastes paths into generated code without escaping them, so never import `.css` files from components; keep styles in `app/globals.css` or inline. Vercel builds from a clean path and isn't affected.
