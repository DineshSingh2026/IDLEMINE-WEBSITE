import { ArrowDown, ArrowUp, Bot, Users } from "lucide-react";
import { ecosystem, header } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AgentGamesArt, IdleGamesArt, IdlemineArt } from "./ecosystem/ProductArt";
import { EcoStage } from "./ecosystem/EcoStage";
import { FloatRow } from "./ecosystem/FloatRow";
import { WORLDS, type WorldKey } from "./ecosystem/worlds";

type Product = (typeof ecosystem.products)[number];

const PLAY_BADGE = "/assets/logos/google-play-badge.png";
const IDLE_MARK = "/assets/img/idlemine-mark.png";

/** Section-only keyframes (component CSS imports break the dev compiler under this path). All use
 *  transform/opacity, carry `eco-anim` so they pause off-screen and vanish under reduced motion. */
const CSS = `
@keyframes eco2-floor { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,48px,0); } }
@keyframes eco2-shine { 0%, 55% { transform: translate3d(-120%,0,0) skewX(-20deg); } 85%, 100% { transform: translate3d(320%,0,0) skewX(-20deg); } }
@keyframes eco2-node { 0%, 100% { transform: rotate(45deg) scale(1); opacity: .85; } 50% { transform: rotate(45deg) scale(1.25); opacity: 1; } }
@keyframes eco2-breathe { 0%, 100% { opacity: .75; transform: scale(.96); } 50% { opacity: 1; transform: scale(1.04); } }
.eco2-shine { animation: eco2-shine 5.5s cubic-bezier(.45,0,.55,1) infinite; }
.eco2-node { animation: eco2-node 3.2s ease-in-out infinite; }
.eco2-breathe { animation: eco2-breathe 9s ease-in-out infinite; }
.eco-stage[data-eco="in"] article:not([data-row="in"]) .eco-rise { opacity: 0; transform: translate3d(0,36px,0) scale(.985); }
.eco-stage[data-eco="in"] article:not([data-row="in"]) .eco-fade { opacity: 0; transform: translate3d(0,12px,0); }
@media (prefers-reduced-motion: reduce) {
  .eco-stage article .eco-rise, .eco-stage article .eco-fade { opacity: 1 !important; transform: none !important; }
}
`;

function worldOf(p: Product): WorldKey {
  if (p.tone === "violet") return "violet";
  return p.name === "Idle Games" ? "teal" : "mint";
}

/** Coloured audience pill: Humans (mint) or AI agents (violet). */
function AudienceBadge({ label, agent, icon }: { label: string; agent: boolean; icon?: "up" | "down" }) {
  const c = agent ? WORLDS.violet : WORLDS.mint;
  const Icon = icon === "up" ? ArrowUp : icon === "down" ? ArrowDown : agent ? Bot : Users;
  return (
    <span
      className="relative inline-flex h-8 shrink-0 items-center gap-2 overflow-hidden rounded-full pl-2.5 pr-3.5 font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.1em] sm:h-9 sm:pl-3 sm:pr-4 sm:text-[12.5px]"
      style={{
        color: c.a,
        background: `linear-gradient(135deg, rgba(${c.rgb},0.20), rgba(${c.rgb2},0.08))`,
        boxShadow: `inset 0 0 0 1px rgba(${c.rgb},0.45), inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      <span aria-hidden className="flex size-5 items-center justify-center rounded-full" style={{ background: `rgba(${c.rgb},0.22)` }}>
        <Icon className="size-3" strokeWidth={2.5} />
      </span>
      {label}
      <span
        aria-hidden
        className="eco-anim eco2-shine pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
      />
    </span>
  );
}

function Art({ product }: { product: Product }) {
  switch (product.name) {
    case "Idlemine":
      return <IdlemineArt images={product.images} badge={PLAY_BADGE} mark={IDLE_MARK} />;
    case "Idle Games":
      return <IdleGamesArt logo={product.images[0]} />;
    default:
      return <AgentGamesArt images={product.images} />;
  }
}

/** The product's own coloured light: two overlapping edgeless radial pools behind the art. */
function ArtLight({ world }: { world: WorldKey }) {
  const c = WORLDS[world];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-[14%] -inset-y-[22%]">
      <div
        className="eco-anim eco2-breathe absolute inset-0"
        style={{
          background: `radial-gradient(42% 46% at 44% 50%, rgba(${c.rgb},0.20), rgba(${c.rgb},0.06) 55%, transparent 100%), radial-gradient(34% 40% at 62% 58%, rgba(${c.rgb2},0.16), transparent 100%)`,
        }}
      />
    </div>
  );
}

/**
 * One editorial chapter: floating art on one side, copy on the other, alternating. No container,
 * no border, no surface. The CTA's stretched ::after makes the whole row clickable.
 */
function Chapter({ product, index, flip, base }: { product: Product; index: number; flip?: boolean; base: number }) {
  const world = worldOf(product);
  const c = WORLDS[world];
  const agent = product.tone === "violet";
  return (
    <FloatRow className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10 lg:gap-16">
      <div className={cn("relative min-w-0 md:col-span-7", flip && "md:order-2")}>
        <ArtLight world={world} />
        <div
          className="eco-rise relative h-[300px] sm:h-[380px] lg:h-[440px]"
          style={{ "--eco-d": base, "--eco-base": base } as React.CSSProperties}
        >
          <Art product={product} />
        </div>
      </div>

      <div
        className={cn("eco-fade relative flex min-w-0 flex-col items-start md:col-span-5", flip && "md:order-1")}
        style={{ "--eco-d": base + 180 } as React.CSSProperties}
      >
        <div aria-hidden className="mb-6 flex items-center gap-3 font-mono text-[12px] tracking-[0.18em]" style={{ color: c.a }}>
          <span>{String(index).padStart(2, "0")}</span>
          <span className="h-px w-14" style={{ background: `linear-gradient(90deg, rgba(${c.rgb},0.8), transparent)` }} />
        </div>
        <AudienceBadge label={product.audience} agent={agent} />
        <h3 className="mt-5 font-display text-[40px] font-semibold leading-[44px] tracking-[-0.035em] text-[#F2FBFB] lg:text-[56px] lg:leading-[58px]">
          {product.name}
        </h3>
        <p className="mt-4 max-w-[40ch] text-[17px] leading-[28px] text-[#B5C7CA] lg:text-[18px] lg:leading-[30px]">
          {product.body}
        </p>
        <div className="pt-8">
          <Button
            href={product.cta.href}
            variant="primary"
            icon="external"
            ariaLabel={`${product.cta.label}: ${product.name} (opens in a new tab)`}
            className="static after:absolute after:inset-0 after:content-[''] group-hover:[&>svg]:-translate-y-0.5 group-hover:[&>svg]:translate-x-0.5"
          >
            {product.cta.label}
          </Button>
        </div>
      </div>
    </FloatRow>
  );
}

/** Free floating "Humans → AI agents" spine: a gradient hairline that fades out at both ends. */
function EconomyDivider({ human, agent }: { human: string; agent: string }) {
  return (
    <div aria-hidden className="eco-fade relative flex items-center gap-2.5 sm:gap-5" style={{ "--eco-d": 300 } as React.CSSProperties}>
      {/* soft bloom along the whole spine, edgeless */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 blur-[18px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(0,198,201,0.22), transparent 100%), linear-gradient(90deg, transparent, rgba(61,245,176,0.14) 30%, rgba(155,123,255,0.18) 70%, transparent)",
        }}
      />
      <div className="relative h-px flex-1 overflow-hidden">
        <div
          className="eco-draw-x absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(61,245,176,0.85))", transformOrigin: "100% 50%", "--eco-d": 420 } as React.CSSProperties}
        />
        <div className="eco-anim eco-travel-x absolute inset-y-0 left-0 w-1/5" style={{ background: "linear-gradient(90deg, transparent, #F2FBFB, transparent)" }} />
      </div>
      <AudienceBadge label={human} agent={false} icon="up" />
      <span
        className="eco-anim eco2-node relative size-[9px] shrink-0 rounded-[2px]"
        style={{
          background: "linear-gradient(135deg, #3DF5B0, #00C6C9 50%, #9B7BFF)",
          boxShadow: "0 0 0 4px rgba(0,198,201,0.15), 0 0 18px rgba(0,198,201,0.8)",
        }}
      />
      <AudienceBadge label={agent} agent icon="down" />
      <div className="relative h-px flex-1 overflow-hidden">
        <div
          className="eco-draw-x absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(155,123,255,0.85), transparent)", "--eco-d": 420 } as React.CSSProperties}
        />
        <div
          className="eco-anim eco-travel-x absolute inset-y-0 left-0 w-1/5"
          style={{ background: "linear-gradient(90deg, transparent, #E4DCFF, transparent)", animationDelay: "3.2s" }}
        />
      </div>
    </div>
  );
}

/** Ambient light only: mint at the top, violet low where the agent chapter sits. No grid, no edges. */
function EcoBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="eco-anim eco-drift-a absolute -left-[12%] top-[8%] size-[820px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.07), rgba(0,198,201,0.03) 55%, transparent)" }}
      />
      <div
        className="eco-anim eco-drift-b absolute right-[-10%] top-[36%] size-[700px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.07), transparent)" }}
      />
      <div
        className="eco-anim eco-drift-a absolute bottom-[-8%] left-[10%] size-[900px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.09), rgba(155,123,255,0.03) 60%, transparent)", animationDelay: "-11s" }}
      />
    </div>
  );
}

/**
 * §4 Ecosystem: three borderless editorial chapters that alternate sides (art left, right, left),
 * the human economy first, then a free floating spine, then the AI economy. Every product opens in
 * a new tab via its CTA, whose stretched ::after makes the whole chapter clickable.
 */
export function Ecosystem() {
  const [idlemine, idleGames, agentGames] = ecosystem.products;
  const human = idlemine?.audience ?? "";
  const ai = agentGames?.audience ?? "";

  return (
    <Section id={ecosystem.id} ariaLabelledby="ecosystem-title" bare>
      <style>{CSS}</style>
      <EcoStage>
        <EcoBackground />
        <Container>
          <div className="max-w-[880px]">
            <div className="eco-fade">
              <Eyebrow className="mb-5 text-teal-400">{header.menus[1]?.label}</Eyebrow>
            </div>
            <Heading id="ecosystem-title" size="l" highlight={["$IDLE"]}>
              {ecosystem.title}
            </Heading>
          </div>

          <ol className="mt-10 flex flex-col gap-16 md:gap-20 lg:mt-12">
            {idlemine && (
              <li>
                <Chapter product={idlemine} index={1} base={120} />
              </li>
            )}
            {idleGames && (
              <li>
                <Chapter product={idleGames} index={2} flip base={200} />
              </li>
            )}
            <li aria-hidden className="-my-4 md:-my-6">
              <EconomyDivider human={human} agent={ai} />
            </li>
            {agentGames && (
              <li>
                <Chapter product={agentGames} index={3} base={200} />
              </li>
            )}
          </ol>
        </Container>
      </EcoStage>
    </Section>
  );
}
