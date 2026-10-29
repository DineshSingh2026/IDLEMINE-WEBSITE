// Turns the official xStocks token logos (400×400 squares with a dark "x" triangle on each edge)
// into clean circular tokens: the edge triangles are repainted with the logo's own background colour,
// then the image is clipped to a perfect circle with a transparent outside. The asset's mark is untouched.
// Usage: node scripts/round-tokens.mjs   → public/assets/logos/round/<TICKER>.png
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "public", "assets", "logos");
const out = join(dir, "round");
mkdirSync(out, { recursive: true });
const tickers = ["TSLAx", "NVDAx", "COINx", "CRCLx", "MSTRx", "HOODx", "GLDx", "QQQx", "GOOGLx", "SPCXx"];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
for (const t of tickers) {
  let src;
  try {
    src = "data:image/png;base64," + readFileSync(join(dir, `${t}.png`)).toString("base64");
  } catch {
    continue;
  }
  const dataUrl = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const W = img.width;
    const c = document.createElement("canvas");
    c.width = c.height = W;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0, W, W);
    const d = x.getImageData(0, 0, W, W);
    const at = (px, py) => { const i = (py * W + px) * 4; return [d.data[i], d.data[i + 1], d.data[i + 2]]; };
    const bg = at(Math.round(W * 0.2), Math.round(W * 0.3)); // main colour
    const dark = at(W / 2, 4); // triangle colour
    const s = W / 400;
    const half = 65 * s + 4 * s; // triangle half-base (+ antialias margin)
    const inTri = (px, py) => {
      const c0 = W / 2;
      return (
        Math.abs(px - c0) <= half - py || // top
        Math.abs(px - c0) <= half - (W - 1 - py) || // bottom
        Math.abs(py - c0) <= half - px || // left
        Math.abs(py - c0) <= half - (W - 1 - px) // right
      );
    };
    // Distance from a colour to the dark→bg segment in RGB.
    const segDist = (p) => {
      const v = bg.map((b, k) => b - dark[k]);
      const w = p.map((q, k) => q - dark[k]);
      const vv = v.reduce((a, b) => a + b * b, 0) || 1;
      const tt = Math.max(0, Math.min(1, w.reduce((a, b, k) => a + b * v[k], 0) / vv));
      return Math.hypot(...w.map((q, k) => q - tt * v[k]));
    };
    for (let py = 0; py < W; py++) {
      for (let px = 0; px < W; px++) {
        if (!inTri(px, py)) continue;
        const p = at(px, py);
        if (segDist(p) < 24) {
          const i = (py * W + px) * 4;
          d.data[i] = bg[0]; d.data[i + 1] = bg[1]; d.data[i + 2] = bg[2];
        }
      }
    }
    x.putImageData(d, 0, 0);
    // Clip to a perfect circle.
    const o = document.createElement("canvas");
    o.width = o.height = W;
    const ox = o.getContext("2d");
    ox.beginPath();
    ox.arc(W / 2, W / 2, W / 2, 0, Math.PI * 2);
    ox.closePath();
    ox.clip();
    ox.drawImage(c, 0, 0);
    return o.toDataURL("image/png");
  }, src);
  const name = t.replace(/x$/, "");
  writeFileSync(join(out, `${name}.png`), Buffer.from(dataUrl.split(",")[1], "base64"));
  console.log(`round/${name}.png`);
}
await browser.close();
