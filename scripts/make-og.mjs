// Renders the social share cards (1200×630) and touch icons from the real IdleMine mark.
// The live site references /assets/og/*.png, favicon-32.png and apple-touch-icon.png but never shipped them.
// Usage: node scripts/make-og.mjs   (uses the installed Edge via playwright-core; no dev server needed)
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "public");
const mark = "data:image/png;base64," + readFileSync(join(root, "assets/img/idlemine-mark.png")).toString("base64");

// Titles + descriptions are the real per-page OG copy.
const cards = [
  { file: "home", eyebrow: "The $IDLE ecosystem", title: "The token that powers play.", sub: "Play on IdleMine Games and collect rewards in $IDLE.", bg: "#08090E" },
  { file: "ecosystem", eyebrow: "Ecosystem", title: "The $IDLE ecosystem", sub: "IdleMine Games is live today. More are on the way.", bg: "#08090E" },
  { file: "tokenomics", eyebrow: "Tokenomics", title: "IDLE is Economic Ownership", sub: "Backed by platform revenue and market buybacks.", bg: "#07061F" },
  { file: "roadmap", eyebrow: "Roadmap", title: "The road for $IDLE", sub: "From one game in 2021 to a growing ecosystem of games.", bg: "#08090E" },
  { file: "liquidity", eyebrow: "Liquidity", title: "Liquidity Pools", sub: "Earn yield on IDLE / SOL with full custody of your assets.", bg: "#07061F" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const goldify = (s) => esc(s).replace(/\$IDLE/g, '<span class="g">$IDLE</span>');

const html = (c) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700&family=Inter:wght@500&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:${c.bg};color:#F5F6FA;font-family:Inter,sans-serif;position:relative;overflow:hidden}
  .blob{position:absolute;border-radius:50%;filter:blur(110px)}
  .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:32px 32px;
        mask-image:radial-gradient(ellipse at 70% 50%,#000 20%,transparent 75%)}
  .wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
  .brand{display:flex;align-items:center;gap:14px;font:700 30px 'Inter Tight';letter-spacing:-.02em}
  .brand img{width:48px;height:48px}
  .eb{font:500 18px Inter;text-transform:uppercase;letter-spacing:.14em;color:#8A90A6;display:flex;align-items:center;gap:14px}
  .eb:before{content:"";width:34px;height:2px;background:linear-gradient(90deg,#F5C542,transparent)}
  h1{font:700 88px/0.98 'Inter Tight';letter-spacing:-.04em;max-width:760px;margin-top:22px}
  .g{background:linear-gradient(90deg,#F5C542,#FFE08A 50%,#F5C542);-webkit-background-clip:text;color:transparent}
  p{font:500 26px/1.4 Inter;color:#A6ABBD;max-width:640px;margin-top:22px}
  .foot{display:flex;justify-content:space-between;align-items:center;font:500 18px Inter;color:#6B7085}
  .sol{background:linear-gradient(90deg,#9945FF,#14F195);-webkit-background-clip:text;color:transparent;font-weight:700}
  .coin{position:absolute;right:-40px;top:115px;width:400px;height:400px;border-radius:50%;
        background:conic-gradient(from 210deg,#C9931E,#FFE08A,#F5C542,#C9931E,#FFE08A,#C9931E);
        box-shadow:0 0 120px rgba(245,197,66,.35),inset 0 0 40px rgba(0,0,0,.35);padding:26px}
  .coin img{width:100%;height:100%;border-radius:50%;box-shadow:0 0 0 6px rgba(0,0,0,.25)}
</style></head><body>
  <div class="blob" style="width:620px;height:620px;right:-120px;top:-160px;background:#F5C542;opacity:.22"></div>
  <div class="blob" style="width:560px;height:560px;right:240px;bottom:-320px;background:#9945FF;opacity:.32"></div>
  <div class="blob" style="width:420px;height:420px;left:-180px;top:-140px;background:#14F195;opacity:.12"></div>
  <div class="dots"></div>
  <div class="coin"><img src="${mark}"></div>
  <div class="wrap">
    <div class="brand"><img src="${mark}">IdleMine</div>
    <div><div class="eb">${esc(c.eyebrow)}</div><h1>${goldify(c.title)}</h1><p>${goldify(c.sub)}</p></div>
    <div class="foot"><span>idlemine.io</span><span>Built on <span class="sol">Solana</span></span></div>
  </div>
</body></html>`;

const icon = (size) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;background:#08090E;display:grid;place-items:center">
<img src="${mark}" style="width:${Math.round(size * 0.86)}px;height:${Math.round(size * 0.86)}px"></body></html>`;

mkdirSync(join(root, "assets/og"), { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
for (const c of cards) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html(c), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, `assets/og/${c.file}.png`) });
  await page.close();
  console.log(`og/${c.file}.png`);
}
for (const [name, size] of [["apple-touch-icon.png", 180], ["favicon-32.png", 32]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(icon(size));
  await page.screenshot({ path: join(root, `assets/img/${name}`), omitBackground: false });
  await page.close();
  console.log(name);
}
await browser.close();
