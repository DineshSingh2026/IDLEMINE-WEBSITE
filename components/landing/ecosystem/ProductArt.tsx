import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Living artwork for the three ecosystem cards, built as depth layers (back, mid, fore).
 * Each <Layer> nests three transform owners so they never fight:
 *   data-depth (scroll parallax, EcoStage) > data-tilt (pointer parallax, TiltCard) > eco-fade (entrance)
 * and the loops (eco-anim) sit on the children. Transform/opacity only; loops pause off-screen and are
 * removed under reduced motion. Everything is full colour: no grayscale, no desaturation.
 */

function Layer({
  depth = 0,
  tilt = 0,
  delay = 0,
  className,
  children,
}: {
  depth?: number;
  tilt?: number;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-depth={depth} className="pointer-events-none absolute inset-0 will-change-transform">
      <div data-tilt={tilt} className="absolute inset-0">
        <div className={cn("eco-fade absolute inset-0", className)} style={{ "--eco-d": `calc(var(--eco-base, 0) + ${delay})` } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Coin sparkles: [left %, bottom %, size px, duration s, delay s, horizontal drift px]. */
const SPARKS: readonly [number, number, number, number, number, number][] = [
  [6, 22, 6, 5.2, 0, 6],
  [16, 50, 4, 4.4, 1.6, -4],
  [74, 14, 7, 5.8, 0.6, -8],
  [90, 34, 5, 4.6, 2.4, 5],
  [52, 10, 4, 5, 3.2, 3],
  [95, 64, 3, 4.2, 1.1, -3],
  [32, 12, 5, 6, 2.9, -6],
  [64, 52, 3, 4.8, 4, 4],
  [42, 70, 3, 4.4, 3.6, 4],
  [84, 80, 4, 5.4, 0.3, -5],
];

function Sparks({ hue = "mint" }: { hue?: "mint" | "violet" }) {
  return (
    <>
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
              ...(hue === "violet" && {
                background: "radial-gradient(circle at 35% 30%, #F1ECFF 0%, #9B7BFF 45%, #00C6C9 100%)",
                boxShadow: "0 0 10px rgba(155,123,255,0.7)",
              }),
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

/* ─────────────────────────────── Idlemine: mint → teal ─────────────────────────────── */

function ArtTile({
  src,
  alt,
  rot,
  pos,
  late,
}: {
  src: string;
  alt: string;
  rot: string;
  pos: React.CSSProperties;
  late?: boolean;
}) {
  return (
    <div className="absolute aspect-[304/181]" style={{ width: "min(47cqw, 80cqh)", transform: "translate(-50%, -50%)", ...pos }}>
      <div className={cn("eco-anim eco-bob relative h-full w-full", late && "eco-bob-late")}>
        <div className="h-full w-full" style={{ transform: `rotate(${rot})` }}>
          <div
            className="relative h-full w-full overflow-hidden rounded-[16px] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(61,245,176,0.5), 0 30px 60px -24px rgba(1,40,42,0.95), 0 18px 50px -18px rgba(0,198,201,0.5)",
            }}
          >
            <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 45vw" className="object-cover" />
            {/* glass sheen */}
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(155deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 38%)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const RING_MASK = "radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))";
const centred = (size: string, top = "46%"): React.CSSProperties => ({
  width: size,
  height: size,
  left: "50%",
  top,
  transform: "translate(-50%, -50%)",
});

export function IdlemineArt({ images, badge, mark }: { images: readonly string[]; badge: string; mark: string }) {
  const [a, b] = images;
  return (
    <div className="absolute inset-0 [container-type:size] [mask-image:linear-gradient(180deg,#000_84%,transparent)]">
      {/* back: light pool + orbit rings */}
      <Layer depth={-24} tilt={-6} delay={300}>
        <div
          className="eco-anim eco-glow absolute rounded-full"
          style={{
            ...centred("130cqmin"),
            background: "radial-gradient(closest-side, rgba(61,245,176,0.36), rgba(0,198,201,0.16) 50%, transparent)",
          }}
        />
        <div className="absolute rounded-full border border-[rgba(61,245,176,0.18)]" style={centred("104cqmin")} />
        <div className="absolute rounded-full border border-dashed border-[rgba(0,198,201,0.26)]" style={centred("72cqmin")} />
        <div className="absolute" style={centred("104cqmin")}>
          <div
            className="eco-anim eco-spin absolute left-1/2 top-1/2 h-full w-full rounded-full"
            style={{
              animationDuration: "14s",
              background: "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(61,245,176,0.95) 350deg, transparent 360deg)",
              maskImage: RING_MASK,
              WebkitMaskImage: RING_MASK,
            }}
          />
        </div>
      </Layer>

      {/* mid: the two app art pieces, overlapping like dealt cards */}
      <Layer depth={8} tilt={10} delay={420}>
        {a && (
          <ArtTile
            src={a}
            rot="-7deg"
            pos={{ left: "32%", top: "47%" }}
            alt="IdleMine app artwork: a thumbs-up surrounded by $IDLE coins"
          />
        )}
        {b && (
          <ArtTile
            src={b}
            rot="6deg"
            late
            pos={{ left: "68%", top: "56%" }}
            alt="IdleMine app artwork: a sneaker on a step-tracking pad"
          />
        )}
      </Layer>

      {/* fore: the $IDLE coin and the official Google Play badge */}
      <Layer depth={30} tilt={22} delay={560}>
        <div className="absolute" style={centred("min(13cqw, 25cqh)", "21%")}>
          <div
            className="eco-anim eco-glow absolute -inset-[50%] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.6), rgba(0,198,201,0.2) 55%, transparent)" }}
          />
          <div className="eco-anim eco-float relative h-full w-full">
            <Image
              src={mark}
              alt=""
              fill
              sizes="112px"
              className="rounded-full object-contain"
              style={{ boxShadow: "0 0 0 2px rgba(61,245,176,0.6), 0 0 0 7px rgba(61,245,176,0.12), 0 16px 36px -10px rgba(1,40,42,0.95)" }}
            />
          </div>
        </div>
        <div className="absolute bottom-[6%] left-1/2 aspect-[646/250] -translate-x-1/2" style={{ width: "min(28cqw, 50cqh)" }}>
          <div className="eco-anim eco-float relative h-full w-full" style={{ animationDelay: "-2s" }}>
            <Image
              src={badge}
              alt=""
              fill
              sizes="190px"
              className="object-contain"
              style={{ filter: "drop-shadow(0 14px 22px rgba(1,40,42,0.95))" }}
            />
          </div>
        </div>
      </Layer>
      <Layer depth={44} tilt={30} delay={640}>
        <Sparks />
      </Layer>
    </div>
  );
}

/* ─────────────────────────────── Idle Games: teal → cyan ─────────────────────────────── */

const COLUMNS = [
  ["blackjack", "ludo", "plinko", "mines", "rummy", "tetris"],
  ["crash", "uno", "domino-duel", "three-card-poker", "snake-ladder", "coin-flip"],
  ["tic-tac-toe", "dice", "fruit-ninja", "stack-tower", "sheep-battle", "arrow-puzzle"],
  ["tricky-cups", "limbo", "american-roulette", "mafia-roulette", "rabbit-9x", "snake-arcade"],
] as const;
const COL_SPEED = [46, 38, 50, 42];
/** [cover, position, rotation, late phase] */
const FLOATERS: readonly [string, React.CSSProperties, string, boolean][] = [
  ["plinko", { left: "-4%", bottom: "16%" }, "-8deg", false],
  ["blackjack", { right: "-5%", top: "8%" }, "7deg", true],
];

export function IdleGamesArt({ logo }: { logo?: string }) {
  return (
    <div className="absolute inset-0 [container-type:size] [mask-image:linear-gradient(180deg,#000_72%,transparent)]">
      {/* back: the full-colour cover wall on a tilted plane */}
      <Layer depth={-18} tilt={-8} delay={300}>
        <div className="absolute inset-0 [perspective:900px]">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-[190%] w-[150%] gap-2 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ transform: "translate(-50%, -50%) rotateX(28deg) rotateZ(-12deg)", transformOrigin: "50% 50%" }}
          >
            {COLUMNS.map((col, ci) => (
              <div key={ci} className="relative flex-1 overflow-hidden">
                <div
                  className={cn("eco-anim flex flex-col", ci % 2 ? "eco-col-down" : "eco-col-up")}
                  style={{ "--eco-dur": `${COL_SPEED[ci]}s`, animationDelay: `${-ci * 9}s` } as React.CSSProperties}
                >
                  {[...col, ...col, ...col].map((c, i) => (
                    <div key={`${c}-${i}`} className="shrink-0 pb-2">
                      <div
                        className="relative aspect-[960/498] w-full overflow-hidden rounded-[8px]"
                        style={{ boxShadow: "0 0 0 1px rgba(77,217,219,0.28)" }}
                      >
                        <Image src={`/assets/img/games/${c}.webp`} alt="" fill sizes="200px" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* teal atmosphere over the wall: edges sink into the card's colour world */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,22,26,0.55) 0%, rgba(5,22,26,0) 30%, rgba(5,22,26,0) 60%, rgba(5,22,26,0.7) 100%), radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(5,22,26,0.7) 100%)",
          }}
        />
      </Layer>

      {/* mid: soft halo so the logo reads, plus orbit */}
      <Layer depth={6} tilt={6} delay={420}>
        <div
          className="absolute left-1/2 top-[46%] aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(4,30,34,0.92) 30%, rgba(4,30,34,0.55) 62%, transparent)" }}
        />
        <div
          className="eco-anim eco-glow absolute left-1/2 top-[46%] aspect-square w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.42), rgba(77,217,219,0.12) 55%, transparent)" }}
        />
        <div className="absolute left-1/2 top-[46%] aspect-square w-[46%] max-w-[260px] -translate-x-1/2 -translate-y-1/2">
          <div
            className="eco-anim eco-spin absolute left-1/2 top-1/2 h-full w-full rounded-full"
            style={{
              animationDuration: "10s",
              background: "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(77,217,219,0.95) 345deg, transparent 360deg)",
              maskImage: "radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
              WebkitMaskImage: "radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
            }}
          />
          <div className="absolute inset-0 rounded-full border border-[rgba(77,217,219,0.18)]" />
        </div>
      </Layer>

      {/* fore: two covers lifted off the wall, nearest to the viewer */}
      <Layer depth={40} tilt={28} delay={640}>
        {FLOATERS.map(([c, pos, rot, late]) => (
          <div key={c} className="absolute aspect-[960/498]" style={{ width: "min(27cqw, 40cqh)", ...pos }}>
            <div className={cn("eco-anim eco-bob h-full w-full", late && "eco-bob-late")}>
              <div
                className="relative h-full w-full overflow-hidden rounded-[10px] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                style={{
                  transform: `rotate(${rot})`,
                  boxShadow:
                    "0 0 0 1px rgba(77,217,219,0.65), 0 24px 40px -16px rgba(2,22,26,0.95), 0 0 36px -8px rgba(0,198,201,0.6)",
                }}
              >
                <Image src={`/assets/img/games/${c}.webp`} alt="" fill sizes="220px" className="object-cover" />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(150deg, rgba(255,255,255,0.25), transparent 40%)" }}
                />
              </div>
            </div>
          </div>
        ))}
      </Layer>

      {/* fore: the logo */}
      <Layer depth={26} tilt={18} delay={560}>
        {logo && (
          <div className="absolute left-1/2 top-[46%] aspect-square w-[36%] max-w-[200px] -translate-x-1/2 -translate-y-1/2">
            <div className="eco-anim eco-float relative h-full w-full">
              <Image
                src={logo}
                alt="Idle Games logo"
                fill
                sizes="200px"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                style={{ filter: "drop-shadow(0 16px 28px rgba(1,30,34,0.9))" }}
              />
            </div>
          </div>
        )}
      </Layer>
    </div>
  );
}

/* ─────────────────────────────── Agent Games: violet → teal ─────────────────────────────── */

/** Floating "data cubes": [left %, top %, size px, delay s, violet?]. */
const CUBES: readonly [number, number, number, number, boolean][] = [
  [8, 22, 14, 0, true],
  [16, 70, 10, -2, false],
  [88, 18, 12, -4, false],
  [92, 62, 16, -1, true],
  [50, 8, 8, -3, true],
  [70, 86, 9, -5, false],
];

function Arena({ src, alt, side }: { src: string; alt: string; side: "l" | "r" }) {
  const l = side === "l";
  return (
    <div
      className={cn("absolute top-[47%] aspect-[3/4]", l ? "right-[51%]" : "left-[51%]")}
      style={{ width: "min(38cqw, 55cqh)", transform: `translateY(-50%) perspective(900px) rotateY(${l ? 20 : -20}deg)`, transformOrigin: l ? "100% 50%" : "0% 50%" }}
    >
      <div className={cn("eco-anim eco-bob relative h-full w-full", !l && "eco-bob-late")}>
        <div
          className="relative h-full w-full overflow-hidden rounded-[16px]"
          style={{
            boxShadow:
              "0 0 0 1px rgba(155,123,255,0.55), 0 0 0 5px rgba(155,123,255,0.08), 0 40px 70px -30px rgba(10,6,30,0.95), 0 0 70px -18px rgba(155,123,255,0.55)",
          }}
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 40vw" className={cn("object-cover", l ? "eco-anim eco-kb-a" : "eco-anim eco-kb-b")} />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 34%, transparent 70%, rgba(155,123,255,0.22) 100%)" }}
          />
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div className="eco-anim eco-scan absolute inset-0" style={{ animationDelay: l ? "0.8s" : "4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentGamesArt({ images, character }: { images: readonly string[]; character: string }) {
  const [a, b] = images;
  return (
    <div className="absolute inset-0 [container-type:size] [mask-image:linear-gradient(180deg,#000_72%,transparent)] md:[mask-image:linear-gradient(90deg,transparent,#000_20%)]">
      {/* back: violet light + a perspective arena floor */}
      <Layer depth={-20} tilt={-6} delay={300}>
        <div
          className="eco-anim eco-glow absolute left-1/2 top-[44%] aspect-square w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.40), rgba(0,198,201,0.12) 55%, transparent)" }}
        />
        <div className="absolute inset-x-[-30%] bottom-[-6%] h-[52%] [perspective:520px]">
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: "rotateX(64deg)",
              transformOrigin: "50% 100%",
              maskImage: "radial-gradient(60% 90% at 50% 100%, #000 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(60% 90% at 50% 100%, #000 30%, transparent 75%)",
            }}
          >
            <div
              className="eco-anim absolute inset-x-0 -top-[48px] bottom-0 [animation:eco2-floor_3.2s_linear_infinite]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(155,123,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(0,198,201,0.45) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>
        </div>
      </Layer>

      {/* mid: the two arena renders, angled like twin screens */}
      <Layer depth={10} tilt={12} delay={440}>
        {a && <Arena src={a} side="l" alt="Agent Games arena: Territory Control" />}
        {b && <Arena src={b} side="r" alt="Agent Games arena: Food Collector" />}
        {/* live indicator on the left screen */}
        <span aria-hidden className="absolute left-1/2 top-[16%] flex size-2.5 -translate-x-1/2">
          <span className="eco-anim eco-ping absolute inset-0 rounded-full bg-[#9B7BFF]" />
          <span className="relative size-2.5 rounded-full bg-[#9B7BFF] shadow-[0_0_12px_rgba(155,123,255,1)]" />
        </span>
      </Layer>

      {/* fore: the agent character + data cubes */}
      <Layer depth={34} tilt={26} delay={600}>
        <div className="absolute bottom-[8%] left-1/2 aspect-square w-[15%] min-w-[64px] max-w-[120px] -translate-x-1/2">
          <div
            className="eco-anim eco-glow absolute -inset-[40%] rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.35), rgba(155,123,255,0.2) 55%, transparent)" }}
          />
          <div className="eco-anim eco-float relative h-full w-full">
            <Image
              src={character}
              alt=""
              fill
              sizes="120px"
              className="object-contain"
              style={{ filter: "drop-shadow(0 18px 20px rgba(10,6,30,0.9))" }}
            />
          </div>
        </div>
        {CUBES.map(([l, t, sz, d, v], i) => (
          <span
            key={i}
            className="eco-anim eco-bob absolute rounded-[3px]"
            style={{
              left: `${l}%`,
              top: `${t}%`,
              width: sz,
              height: sz,
              animationDelay: `${d}s`,
              background: v
                ? "linear-gradient(135deg, #CFC1FF, #9B7BFF 55%, #5B3FD0)"
                : "linear-gradient(135deg, #B3F0F1, #00C6C9 55%, #018082)",
              boxShadow: v ? "0 0 14px rgba(155,123,255,0.8)" : "0 0 14px rgba(0,198,201,0.8)",
            }}
          />
        ))}
      </Layer>
      <Layer depth={46} tilt={32} delay={680}>
        <Sparks hue="violet" />
      </Layer>
    </div>
  );
}
