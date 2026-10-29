/**
 * Monochrome token marks.
 *
 * The xStocks logos are full-bleed coloured squares, so a CSS grayscale filter turns them into
 * muddy grey tiles. Instead, each logo is keyed by luminance with an SVG colour matrix: the mark
 * becomes pure white on a transparent ground, the coloured square disappears. Some marks are
 * light-on-colour, some dark-on-colour, so polarity + threshold are tuned per logo (measured
 * from the PNG luminance histograms).
 */
/** `scale` optically balances the marks (wordmarks need more size than glyphs to read). */
type Key = { polarity: "light" | "dark"; t: number; scale: number };

export const MONO_KEYS: Record<string, Key> = {
  TSLA: { polarity: "light", t: 0.6, scale: 1.05 },
  NVDA: { polarity: "light", t: 0.82, scale: 1.08 },
  COIN: { polarity: "light", t: 0.6, scale: 0.92 },
  CRCL: { polarity: "light", t: 0.45, scale: 0.98 },
  MSTR: { polarity: "dark", t: 0.15, scale: 1.42 },
  HOOD: { polarity: "dark", t: 0.25, scale: 1.02 },
  GLDX: { polarity: "dark", t: 0.42, scale: 1.16 },
};

export const monoScale = (ticker: string) => MONO_KEYS[ticker]?.scale ?? 1;

/** Edge softness: alpha ramps over ~1/K of luminance, giving anti-aliased edges. */
const K = 9;

function alphaRow({ polarity, t }: Key) {
  const s = polarity === "light" ? K : -K;
  const r = (0.2126 * s).toFixed(4);
  const g = (0.7152 * s).toFixed(4);
  const b = (0.0722 * s).toFixed(4);
  const o = (0.5 - s * t).toFixed(4);
  return `${r} ${g} ${b} 0 ${o}`;
}

export const monoFilterId = (ticker: string) => `rwa-mono-${ticker.toLowerCase()}`;

/** Hidden SVG holding one filter per logo. Render once per page, inside the RWA section. */
export function MonoFilters() {
  return (
    <svg aria-hidden width="0" height="0" className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        {Object.entries(MONO_KEYS).map(([ticker, key]) => (
          <filter key={ticker} id={monoFilterId(ticker)} colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
            <feColorMatrix
              type="matrix"
              values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${alphaRow(key)}`}
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
