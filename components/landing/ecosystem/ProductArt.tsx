import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Living artwork for the three ecosystem cards. Every frame shares one 5:4 aspect ratio, a bg-void
 * ground with a faint dot grid (static â€” it reads as depth while the art layer parallaxes against
 * the card tilt via `data-eco-parallax`), and hairline-framed tiles. All loops are CSS
 * (`ecosystem.css`, `eco-anim`): transform/opacity only, paused off-screen, removed for reduced motion.
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
    <div
      className={cn(
        "absolute overflow-hidden border border-white/10 bg-surface-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
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
        <div data-eco-parallax className="absolute inset-0">
          {children}
        </div>
      </div>
      {/* glass edge: a top-lit inner hairline over everything */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      />
    </div>
  );
}

/** Rising coin sparkles: [left %, bottom %, size px, duration s, delay s, horizontal drift px]. */
const SPARKS: readonly [number, number, number, number, number, number][] = [
  [6, 18, 5, 5.2, 0, 6],
  [14, 44, 3, 4.4, 1.6, -4],
  [72, 8, 6, 5.8, 0.6, -8],
  [88, 30, 4, 4.6, 2.4, 5],
  [50, 4, 3, 5, 3.2, 3],
  [93, 62, 3, 4.2, 1.1, -3],
  [30, 6, 4, 6, 2.9, -6],
  [62, 46, 3, 4.8, 4, 4],
  [4, 70, 3, 4.4, 3.6, 4],
];

/** Idlemine â€” the two app art pieces as offset tiles, bobbing out of phase, with rising $IDLE sparkles. */
export function IdlemineArt({ images }: { images: readonly string[] }) {
  const [a, b] = images;
  return (
    <>
      <div aria-hidden className="absolute inset-0">
        {SPARKS.map(([l, bt, sz, dur, delay, sx], i) => (
          <span
            key={i}
            className="eco-anim eco-spark absolute rounded-full"
            style={
              {
                left: `${l}%`,
                bottom: `${bt}%`,
                width: sz,
                height: sz,
                "--eco-dur": `${dur}s`,
                "--eco-delay": `${delay}s`,
                "--eco-sx": `${sx}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {a && (
        <div className="eco-anim eco-bob absolute left-[8%] top-[10%] aspect-[304/181] w-[60%]">
          <Tile
            src={a}
            alt="IdleMine app artwork: a thumbs-up surrounded by $IDLE coins"
            className="inset-0 rounded-[12px]"
          />
        </div>
      )}
      {b && (
        <div className="eco-anim eco-bob eco-bob-late absolute bottom-[10%] right-[8%] aspect-[312/181] w-[60%]">
          <Tile
            src={b}
            alt="IdleMine app artwork: a sneaker on a step-tracking pad"
            className="inset-0 rounded-[12px]"
          />
        </div>
      )}
    </>
  );
}

/** All 24 real game covers, dealt into four columns that scroll in alternating directions. */
const COLUMNS = [
  ["blackjack", "ludo", "plinko", "mines", "rummy", "tetris"],
  ["crash", "uno", "domino-duel", "three-card-poker", "snake-ladder", "coin-flip"],
  ["tic-tac-toe", "dice", "fruit-ninja", "stack-tower", "sheep-battle", "arrow-puzzle"],
  ["tricky-cups", "limbo", "american-roulette", "mafia-roulette", "rabbit-9x", "snake-arcade"],
] as const;
const COL_SPEED = [40, 34, 44, 37];

/** Idle Games â€” the logo floating over an endlessly scrolling, dimmed wall of real game covers. */
export function IdleGamesArt({ logo }: { logo?: string }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-[175%] w-[135%] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] gap-1.5 opacity-50 saturate-[0.8] transition-opacity duration-[250ms] ease-out group-hover:opacity-75"
      >
        {COLUMNS.map((col, ci) => (
          <div key={ci} className="relative flex-1 overflow-hidden">
            <div
              className={cn("eco-anim flex flex-col", ci % 2 ? "eco-col-down" : "eco-col-up")}
              style={
                { "--eco-dur": `${COL_SPEED[ci]}s`, animationDelay: `${-ci * 9}s` } as React.CSSProperties
              }
            >
              {/* three identical sets; per-tile bottom padding (not flex gap) keeps the -33.33% loop seamless */}
              {[...col, ...col, ...col].map((c, i) => (
                <div key={`${c}-${i}`} className="shrink-0 pb-1.5">
                  <div className="relative aspect-[960/498] w-full overflow-hidden rounded-[6px] border border-white/5">
                    <Image src={`/assets/img/games/${c}.webp`} alt="" fill sizes="160px" className="object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* vignette so the logo reads cleanly and edges fall to void */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 50% at 50% 50%, rgba(5,8,10,0.92) 0%, rgba(5,8,10,0.6) 55%, rgba(5,8,10,0.2) 100%)",
        }}
      />
      {logo && (
        <div className="absolute left-1/2 top-1/2 aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2">
          <div
            aria-hidden
            className="eco-anim eco-glow absolute -inset-[30%] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.28), rgba(61,245,176,0.08) 55%, transparent)" }}
          />
          <div className="eco-anim eco-float absolute inset-0">
            <Image
              src={logo}
              alt="Idle Games logo"
              fill
              sizes="160px"
              className="object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      )}
    </>
  );
}

/** Agent Games â€” the two arena renders as a matched portrait pair, slowly panning under a scan line. */
export function AgentGamesArt({ images }: { images: readonly string[] }) {
  const [a, b] = images;
  return (
    <>
      {a && (
        <Tile
          src={a}
          alt="Agent Games arena: Territory Control"
          className="left-[6%] top-1/2 aspect-[3/4] w-[42.5%] -translate-y-1/2 rounded-[12px]"
          imgClassName="eco-anim eco-kb-a"
        />
      )}
      {b && (
        <Tile
          src={b}
          alt="Agent Games arena: Food Collector"
          className="right-[6%] top-1/2 aspect-[3/4] w-[42.5%] -translate-y-1/2 rounded-[12px]"
          imgClassName="eco-anim eco-kb-b"
        />
      )}
      <div aria-hidden className="pointer-events-none absolute -inset-[12px] overflow-hidden">
        <div className="eco-anim eco-scan absolute inset-0" />
      </div>
      {/* live indicator: a pulsing agent-violet dot, no label */}
      <span aria-hidden className="absolute left-[calc(6%+10px)] top-[calc(14.6%+10px)] flex size-2">
        <span className="eco-anim eco-ping absolute inset-0 rounded-full bg-violet" />
        <span className="relative size-2 rounded-full bg-violet shadow-[0_0_10px_rgba(155,123,255,0.9)]" />
      </span>
    </>
  );
}
