// Visual QA: screenshots a page of the running dev server with the installed Edge.
// Usage: node scripts/shot.mjs <path> [width=1440] [--full] [--scroll=<px>] [--out=name]
//   node scripts/shot.mjs /tokenomics 390 --full
// Writes .shots/<name>.png and prints the path plus any console errors.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const path = args.find((a) => a.startsWith("/")) ?? "/";
const width = Number(args.find((a) => /^\d+$/.test(a)) ?? 1440);
const full = args.includes("--full");
const scroll = Number((args.find((a) => a.startsWith("--scroll=")) ?? "--scroll=0").split("=")[1]);
const name =
  (args.find((a) => a.startsWith("--out=")) ?? "").split("=")[1] ||
  `${path.replace(/[^a-z0-9]+/gi, "_") || "home"}_${width}${full ? "_full" : ""}${scroll ? `_s${scroll}` : ""}`;

const base = process.env.BASE_URL ?? "http://localhost:3333";
const outDir = join(import.meta.dirname, "..", ".shots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(base + path, { waitUntil: "networkidle", timeout: 60000 });
// Walk the page so whileInView reveals fire before capture.
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(600);
if (scroll) {
  await page.evaluate((y) => window.scrollTo(0, y), scroll);
  await page.waitForTimeout(900);
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const file = join(outDir, `${name}.png`);
await page.screenshot({ path: file, fullPage: full });
await browser.close();

console.log(file);
if (overflow > 0) console.log(`WARN horizontal overflow: ${overflow}px`);
if (errors.length) console.log("CONSOLE ERRORS:\n" + errors.join("\n"));
