/** 1.5% film-grain overlay (SVG feTurbulence) — hero only. */
export function Grain({ opacity = 0.015 }: { opacity?: number }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: opacity * 6 }}>
      <filter id="grain-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  );
}
