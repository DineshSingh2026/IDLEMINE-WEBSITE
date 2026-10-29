# $IDLE Design System v1 + Revamp Brief (client documents, Oct 29 2026) — SOURCE OF TRUTH

This supersedes SPEC.md wherever they differ. The old gold palette is OFF-BRAND (the client rated it 2/10).
Brand: teal from the IdleMine coin, a dark high-contrast ground inspired by solana.com, and two accents: **mint = humans**, **violet = AI agents**.
"Borrow solana.com's STRUCTURE, not its visual design": one bold statement up top, live proof in numbers, clear product paths, a clean INSTITUTIONAL feel.

## Colour (dark theme)
| token | hex | Tailwind class | use |
|---|---|---|---|
| bg-void | #05080A | `bg-bg` | page background |
| surface-1 | #0B1114 | `bg-surface` | cards, nav dropdowns, stat tiles, FAQ rows |
| surface-2 | #111A1E | `bg-surface-2` | raised elements in a card: inputs, list rows, contract chips |
| border | #1C2A2F | `border-line` | hairline dividers, card outlines |
| border-strong | #4D666C | `border-line-strong` | input + secondary-button outlines |
| text-primary | #F2FBFB | `text-ink` | headlines and body |
| text-secondary | #9FB3B7 | `text-ink-2` | supporting copy, stat labels |
| text-muted | #6E8589 | `text-ink-3` | captions, timestamps, "Coming soon" |
| teal-400 IDLE Glow | #00C6C9 | `text-teal-400` | accent text on dark: links, highlights, the $IDLE ticker |
| teal-500 IDLE Teal | #01AFB1 | `bg-teal-500` | PRIMARY BUTTON fill with dark text (#05080A) |
| teal-300 | #4DD9DB | | hover of teal-400 |
| teal-600 / 700 / 900 | #019597 / #018082 / #013B3D | | pressed / big brand blocks / tinted section bg (e.g. RWA band) |
| mint | #3DF5B0 | `text-mint` | human-economy accent: rewards, positive numbers, Live dots |
| agent-violet | #9B7BFF | `text-violet` | agentic accent: Agent Games, AI agent cards |
| warning / error / success | #FFB547 / #FF6B78 / #2BD98A | `text-warning` … | risk notes, contract warnings / errors / Done |

Gradients (use SPARINGLY): `gradient-idle` #018082 → #00C6C9 → #3DF5B0 (hero logo glow, ONE highlighted word, a thin top border on a featured card) = `text-grad-brand`.
`gradient-economies` #00C6C9 → #9B7BFF, ONLY where both economies appear together (hero underline, ecosystem divider) = `text-grad-sol`.
**Proportion: ~80% neutrals, 15% teal, 5% mint/violet. If a screen looks colourful it has too much accent.**
NEVER use Solana's exact #9945FF, #14F195 or its gradient. (Legacy class names `gold`/`gold-2` now map to teal-400/300 — prefer the explicit teal-* classes in new code.)

## Typography (Inter Tight / Inter / JetBrains Mono — already loaded)
hero 80/84 600 -0.04em (`text-display-xl`) · h2 52/56 600 -0.03em (`text-display-l`) · h3 28/34 600 -0.02em (`text-heading-m`) · stat 56/60 600 -0.03em (`text-stat`) · lead 20/30 400 (`text-body-l`) · body 16/26 (`text-body`) · small 14/20 · **eyebrow JetBrains Mono 13/16 500 0.08em uppercase teal** (`text-eyebrow`) · data JetBrains Mono 14/20.
Headings: weight 600, never 700/800. No gold-highlighted $IDLE in body paragraphs — accent colour max once per section.

## Spacing & radius
4 / 8 / 16 / 24 (card padding, grid gap) / 48 (heading → content) / **120px between sections desktop, 64px mobile** (`Section` already does this).
radius-sm 8 (chips, inputs, small buttons) · **radius-md 12 (buttons, list rows)** · **radius-lg 20 (cards, product tiles)** · full (pills, status dots, token logos).

## Rules
- Buttons: primary = teal-500 fill + #05080A text (Button `variant="primary"`); secondary = border-strong outline. 12px radius. NOT pills. No glows.
- **Client override (Oct 29):** the client wants a colourful, premium, animated site — no flat grey or black-and-white boxes or images. Tinted brand surfaces (teal-900 gradients), gradient borders and soft brand-colour glows on featured cards are approved. Never use grayscale/desaturate filters. No dash characters in visible copy. Text contrast stays AA.
- Mint and violet are for labels, icons, dots and chart series — not long paragraphs.
- Logo only on bg-void or surface-1; clear space = leaf height; don't recolour it or add shadows.
- **Motion 200–300ms ease-out**; the hero background drifts slowly; honour reduce-motion (still frame).
- Institutional and calm: fewer decorations, more precision. Alignment on a strict 12-col grid, consistent gutters, no empty voids between sections, no visible seams between section backgrounds (one continuous bg-void canvas; tinted bands only where the brief asks).

## Page (single long home page, order fixed)
1 Header/nav · 2 Hero · 3 Stats · 4 Ecosystem (3 products) · 5 Real World Assets x $IDLE (`id="rwa"`) · 6 FAQs · 7 Footer.
ALL copy, links, numbers and TODO flags live in `data/content/landing.ts`. Use it verbatim; never invent copy, links or numbers.

## Tooling
Dev server: http://localhost:3333 (already running — never start/stop it, no `next build`, no git commit).
Screenshots: `node scripts/shot.mjs / 1440` (viewport) · `node scripts/tour.mjs / 1440` (section-by-section viewport shots → .shots/tour_*). Read the PNGs and iterate.
Type check: `npx tsc --noEmit 2>&1 | grep -v TS6053 | grep <your files>`.
The project folder name contains an apostrophe: never import .css files from components (it breaks the dev compiler); use Tailwind classes or inline <style>. Prefer Write/Edit tools over bash heredocs.
