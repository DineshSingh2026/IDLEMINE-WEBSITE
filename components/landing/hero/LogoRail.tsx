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

/** Wide, soft edge fade so the logos dissolve into the hero canvas on both sides. */
const MASK = "linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%)";

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
          <span aria-hidden className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink/90">
            {l.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite marquee of real partner / infra logos (full colour) flowing directly over the hero canvas:
 * no band, no background, no lines; only a wide edge fade. Pauses on hover; static under reduced motion.
 */
export function LogoRail() {
  return (
    <div className="hero-rail relative">
      <div
        className="relative overflow-hidden py-6 lg:py-8"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      >
        <div className="hero-rail-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
