import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Artwork compositions for the three ecosystem cards. Every frame shares one 5:4 aspect ratio,
 * a bg-void ground with a faint dot grid, and hairline-framed tiles, so the (illustrated) source art
 * reads as a consistent, curated set rather than three unrelated pictures.
 * The scale-on-hover lives on `.eco-art` and is driven by the card's `group`.
 */

const SIZES = "(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw";

/** Hairline-framed tile with a subtle inner border (sits above the image). */
function Tile({
  src,
  alt,
  className,
  sizes = SIZES,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cn("absolute overflow-hidden border border-white/10 bg-surface-2", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className={cn("object-cover", imgClassName)} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/40"
      />
    </div>
  );
}

export function ArtFrame({ children, tone }: { children: React.ReactNode; tone: "mint" | "violet" }) {
  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-[14px] border border-line bg-bg">
      {/* faint grid + a very soft tone wash at the base, keeps 80/15/5 colour proportion */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(120% 90% at 50% 40%, #000 35%, transparent 85%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            tone === "violet"
              ? "radial-gradient(70% 100% at 50% 100%, rgba(155,123,255,0.10), transparent 70%)"
              : "radial-gradient(70% 100% at 50% 100%, rgba(0,198,201,0.09), transparent 70%)",
        }}
      />
      <div className="eco-art absolute inset-0 transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {children}
      </div>
    </div>
  );
}

/** Idlemine — the two app art pieces as offset, phone-screen-like tiles. */
export function IdlemineArt({ images }: { images: readonly string[] }) {
  const [a, b] = images;
  return (
    <>
      {a && (
        <Tile
          src={a}
          alt="IdleMine app artwork: a thumbs-up surrounded by $IDLE coins"
          className="left-[8%] top-[10%] aspect-[304/181] w-[60%] rounded-[12px]"
        />
      )}
      {b && (
        <Tile
          src={b}
          alt="IdleMine app artwork: a sneaker on a step-tracking pad"
          className="bottom-[10%] right-[8%] aspect-[312/181] w-[60%] rounded-[12px]"
        />
      )}
    </>
  );
}

const COVERS = [
  "blackjack",
  "ludo",
  "plinko",
  "mines",
  "rummy",
  "tetris",
  "crash",
  "uno",
  "domino-duel",
  "three-card-poker",
  "snake-ladder",
  "coin-flip",
  "tic-tac-toe",
  "dice",
  "fruit-ninja",
  "stack-tower",
  "sheep-battle",
  "arrow-puzzle",
  "tricky-cups",
  "limbo",
] as const;

/** Idle Games — the logo over a tidy, dimmed mosaic of real game covers. */
export function IdleGamesArt({ logo }: { logo?: string }) {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 grid w-[112%] -translate-x-1/2 -translate-y-1/2 grid-cols-4 gap-1.5 opacity-55 saturate-[0.8] transition-opacity duration-[250ms] ease-out group-hover:opacity-70">
        {COVERS.map((c) => (
          <div
            key={c}
            className="relative aspect-[960/498] overflow-hidden rounded-[6px] border border-white/5"
          >
            <Image src={`/assets/img/games/${c}.webp`} alt="" fill sizes="120px" className="object-cover" />
          </div>
        ))}
      </div>
      {/* vignette so the logo reads cleanly and edges fall to void */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 52% at 50% 50%, rgba(5,8,10,0.92) 0%, rgba(5,8,10,0.55) 55%, rgba(5,8,10,0.25) 100%)",
        }}
      />
      {logo && (
        <div className="absolute left-1/2 top-1/2 aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2">
          <Image src={logo} alt="Idle Games logo" fill sizes="160px" className="object-contain" />
        </div>
      )}
    </>
  );
}

/** Agent Games — the two arena renders as a matched portrait pair. */
export function AgentGamesArt({ images }: { images: readonly string[] }) {
  const [a, b] = images;
  return (
    <>
      {a && (
        <Tile
          src={a}
          alt="Agent Games arena: Territory Control"
          className="left-[6%] top-1/2 aspect-[3/4] w-[42.5%] -translate-y-1/2 rounded-[12px]"
        />
      )}
      {b && (
        <Tile
          src={b}
          alt="Agent Games arena: Food Collector"
          className="right-[6%] top-1/2 aspect-[3/4] w-[42.5%] -translate-y-1/2 rounded-[12px]"
        />
      )}
    </>
  );
}
