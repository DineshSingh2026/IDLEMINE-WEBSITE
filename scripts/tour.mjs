// Visual review: captures a page as a series of viewport screenshots (reveals fire as it scrolls).
// Usage: node scripts/tour.mjs /route [width=1440]   → .shots/tour_<route>_<n>.png
import { chromium } from "playwright-core";
const args = process.argv.slice(2).map((a) => a.replace(/^[A-Za-z]:[\/].*?Git[\/]/, "/"));
const path = args.find((a) => a.startsWith("/")) ?? "/";
const w = Number(args.find((a) => /^\d+$/.test(a)) ?? 1440), h = w < 768 ? 844 : 900;
const b = await chromium.launch({ channel: "msedge", headless: true });
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto("http://localhost:3333" + path, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(1200);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const name = (path.replace(/[^a-z0-9]+/gi, "") || "home") + "_" + w;
let n = 0;
for (let y = 0; y < total - 100; y += h) {
  await p.evaluate((y) => (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)), y);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `.shots/tour_${name}_${String(n++).padStart(2, "0")}.png` });
}
console.log(name, n, "shots, page height", total);
await b.close();
