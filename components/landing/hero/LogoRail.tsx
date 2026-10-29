import Image from "next/image";

/** Infra the $IDLE ecosystem runs on / trades through, in each brand's own colours. */
const LOGOS = [
  { name: "Solana", src: "/assets/logos/solana.svg", w: 96, h: 84, glow: "rgba(0,209,140,0.45)" },
  { name: "Raydium", src: "/assets/logos/raydium.svg", w: 29, h: 33, glow: "rgba(90,196,190,0.5)" },
  { name: "DEX Screener", src: "/assets/logos/dexscreener.svg", w: 512, h: 512, glow: "rgba(255,255,255,0.35)" },
  { name: "Phantom", src: "/assets/logos/phantom.svg", w: 512, h: 512, glow: "rgba(171,159,242,0.55)" },
  { name: "Solflare", src: "/assets/logos/solflare.svg", w: 290, h: 290, glow: "rgba(255,239,70,0.45)" },
  { name: "USDC", src: "/assets/logos/usdc.png", w: 256, h: 256, glow: "rgba(39,117,202,0.6)" },
];

function Row({ hidden = false }: { hidden?: boolean }) {
  // Each half of the track holds the set twice so it always overflows wide viewports.
  const set = [...LOGOS, ...LOGOS];
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {set.map((l, i) => (
        <li
          key={`${l.name}-${i}`}
          className="hero-logo flex shrink-0 items-center gap-3 px-7 lg:px-10"
          style={{ "--g": l.glow } as React.CSSProperties}
        >
          <Image
            src={l.src}
            alt={hidden || i >= LOGOS.length ? "" : l.name}
            width={l.w}
            height={l.h}
            unoptimized
            className="hero-logo-img h-[26px] w-auto"
          />
          <span aria-hidden className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {l.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Edge-faded infinite marquee of real partner / infra logos (full colour) on a band tinted with
 * the brand gradient. Pauses on hover; static under reduced motion.
 */
export function LogoRail() {
  return (
    <div className="hero-rail relative">
      {/* Tinted band: teal, violet, mint washes + gradient hairlines top and bottom. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 140% at 18% 50%, rgba(0,198,201,0.16), transparent 70%), radial-gradient(50% 140% at 55% 50%, rgba(155,123,255,0.14), transparent 70%), radial-gradient(50% 140% at 88% 50%, rgba(61,245,176,0.12), transparent 70%), linear-gradient(180deg, rgba(11,17,20,0.6), rgba(11,17,20,0.85))",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.7)_20%,rgba(155,123,255,0.7)_55%,rgba(61,245,176,0.7)_85%,transparent)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.35)_25%,rgba(155,123,255,0.35)_60%,transparent)]"
      />
      <div className="hero-rail-mask relative overflow-hidden py-6 lg:py-7">
        <div className="hero-rail-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
