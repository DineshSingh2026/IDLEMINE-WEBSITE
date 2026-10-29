# idlemine.io — $IDLE marketing site

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion · GSAP ScrollTrigger · Lenis · React Three Fiber.
Content comes from the live idlemine.io. The layout and motion language follow solana.com. See `SPEC.md`.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3333
```

Port 3333 is used because 3000 was already taken on the dev machine. To change it, edit the `dev` and `start` scripts in `package.json`.

```bash
npm run build && npm start   # production build on :3333
npm run typecheck
npm run lint
```

## Scripts

| Command | What it does |
|---|---|
| `npm run fetch-assets` | Re-downloads every first-party asset from idlemine.io into `public/assets` and rejects HTML responses disguised as images |
| `node scripts/make-og.mjs` | Renders the 1200×630 OG cards and the touch icons from the real IdleMine mark (uses the installed Edge) |
| `node scripts/shot.mjs /route 390 --full` | Takes a screenshot of the running dev server and saves it to `.shots/` (visual QA) |

## Live data

`GET /api/token` calls the DexScreener API for mint `BjcRmwm8e25RgjkyaFE56fc7bxRgGPw96JUkXRJFEroT`.

- Price and 24h change come from the most liquid pair.
- Volume, liquidity and trades are summed across all pairs.
- Total volume is the live site's hand-counted base ($213,589,723.94 through 2026-10-22) plus each finished UTC day from CoinGecko.
- The data revalidates every 60s and the client refreshes it with SWR every 60s.
- If the API fails, the site shows `—` and does not crash.

## Deploy

Push to GitHub and import the repo in Vercel. No environment variables are needed.

## Decisions that differ from the brief

- **Games live = 24, not 14.** The live HTML contains "14" only as a no-JS fallback. Its script replaces that number with the length of the real game list, which has 24 games. Everything here is driven by `games` in `data/content/site.ts`.
- **Social links are real** (X, Telegram, Instagram, YouTube). They come from the live site's config and are not `#` placeholders.
- **OG images were generated.** The live site references `/assets/og/*.png`, but those URLs return its HTML 404 page, so its share cards are broken today.
- **The roadmap's MidEarth phase is hidden**, because the live config marks it `hidden: true`.
- npm instead of pnpm, and the `lenis` package instead of the deprecated `@studio-freight/lenis`.

## TODO for the client

- [ ] Newsletter provider: `app/api/subscribe/route.ts` currently only validates the email and logs it.
- [ ] Confirm whether to show the "Agentic arena" (MidEarth) roadmap phase (`data/content/site.ts`).
- [ ] Confirm "24 games live" (home and ecosystem) versus the brief's "14".
- [ ] The live site links to Terms, Privacy, Disclaimer and FAQ pages, which are not part of this rebuild.
- [ ] Any third-party logo the build couldn't obtain from an official source is listed in the final hand-off notes.
