// Downloads every first-party asset from the live idlemine.io into /public/assets
// so the repo is self-contained. Run: npm run fetch-assets  (Node 22.6+ strips TS types)
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "public");

const GAME_SLUGS = [
  "arrow-puzzle", "mines", "ludo", "crash", "fruit-ninja", "blackjack", "plinko", "snake-ladder",
  "mafia-roulette", "uno", "limbo", "tricky-cups", "american-roulette", "coin-flip", "three-card-poker",
  "rabbit-9x", "sheep-battle", "rummy", "tic-tac-toe", "domino-duel", "dice", "stack-tower",
  "snake-arcade", "tetris",
];

const SITE = "https://idlemine.io";
const paths = [
  "/assets/img/idlemine-mark.png",
  "/assets/img/idlemine-mark.webp",
  "/assets/img/idlemine-logo.png",
  "/assets/img/idle-games-logo.webp",
  "/assets/img/midearth/logo.png",
  "/assets/img/midearth/foodcollector.webp",
  "/assets/img/midearth/territorycontrol.webp",
  "/assets/img/eco/hero-coin.webp",
  "/assets/img/eco/side-left.webp",
  "/assets/img/eco/side-right.webp",
  "/assets/img/eco/games-art.webp",
  "/assets/img/eco/idle-walk.webp",
  "/assets/img/eco/idle-thumb.webp",
  "/assets/img/favicon-32.png",
  "/assets/img/favicon-64.png",
  "/assets/img/apple-touch-icon.png",
  "/assets/og/home.png",
  "/assets/og/tokenomics.png",
  "/assets/og/ecosystem.png",
  "/assets/og/roadmap.png",
  "/assets/og/liquidity.png",
  ...GAME_SLUGS.map((s) => `/assets/img/games/${s}.webp`),
];

const jobs: Array<{ url: string; out: string }> = [
  ...paths.map((p) => ({ url: SITE + p, out: join(ROOT, p) })),
  { url: `${SITE}/favicon.ico`, out: join(ROOT, "favicon.ico") },
  { url: "https://games.idlemine.io/logo.png", out: join(ROOT, "assets/img/idle-games-logo.png") },
];

let failed = 0;
await Promise.all(
  jobs.map(async ({ url, out }) => {
    try {
      const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 idlemine-asset-fetch" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, buf);
      const { size } = await stat(out);
      if (size < 1024) throw new Error(`only ${size} bytes`);
      console.log(`ok   ${(size / 1024).toFixed(1).padStart(7)}KB  ${url}`);
    } catch (e) {
      failed++;
      console.error(`FAIL ${url}  (${(e as Error).message})`);
    }
  }),
);
console.log(failed ? `\n${failed} asset(s) failed` : `\nAll ${jobs.length} assets downloaded`);
process.exitCode = failed ? 1 : 0;
