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
import { TiltCard } from "./ecosystem/TiltCard";
import { WORLDS, type WorldKey } from "./ecosystem/worlds";

type Product = (typeof ecosystem.products)[number];

const PLAY_BADGE = "/assets/logos/google-play-badge.png";
const IDLE_MARK = "/assets/img/idlemine-mark.png";
const AGENT_CHARACTER = "/assets/img/midearth/logo.png";

/** Section-only keyframes (component CSS imports break the dev compiler under this path). All use
 *  transform/opacity, carry `eco-anim` so they pause off-screen and vanish under reduced motion. */
const CSS = `
@keyframes eco2-floor { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,48px,0); } }
@keyframes eco2-shine { 0%, 55% { transform: translate3d(-120%,0,0) skewX(-20deg); } 85%, 100% { transform: translate3d(320%,0,0) skewX(-20deg); } }
@keyframes eco2-node { 0%, 100% { transform: rotate(45deg) scale(1); opacity: .85; } 50% { transform: rotate(45deg) scale(1.25); opacity: 1; } }
.eco2-shine { animation: eco2-shine 5.5s cubic-bezier(.45,0,.55,1) infinite; }
.eco2-node { animation: eco2-node 3.2s ease-in-out infinite; }
`;

function worldOf(p: Product): WorldKey {
  if (p.tone === "violet") return "violet";
  return p.name === "Idle Games" ? "teal" : "mint";
}

/** Prominent coloured audience badge: Humans (mint) or AI agents (violet). */
function AudienceBadge({ label, agent, icon }: { label: string; agent: boolean; icon?: "up" | "down" }) {
  const c = agent ? WORLDS.violet : WORLDS.mint;
  const Icon = icon === "up" ? ArrowUp : icon === "down" ? ArrowDown : agent ? Bot : Users;
  return (
    <span
      className="relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full pl-3 pr-4 font-mono text-[12.5px] font-medium uppercase leading-none tracking-[0.1em]"
      style={{
        color: c.a,
        background: `linear-gradient(135deg, rgba(${c.rgb},0.20), rgba(${c.rgb2},0.08))`,
        boxShadow: `inset 0 0 0 1px rgba(${c.rgb},0.45), inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      <span
        aria-hidden
        className="flex size-5 items-center justify-center rounded-full"
        style={{ background: `rgba(${c.rgb},0.22)` }}
      >
        <Icon className="size-3" strokeWidth={2.5} />
      </span>
      {label}
      <span
        aria-hidden
        className="eco-anim eco2-shine pointer-events-none absolute inset-y-0 left-0 w-1/3"
        style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)` }}
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
      return <AgentGamesArt images={product.images} character={AGENT_CHARACTER} />;
  }
}

function CardText({ product, wide }: { product: Product; wide?: boolean }) {
  const agent = product.tone === "violet";
  return (
    <>
      <AudienceBadge label={product.audience} agent={agent} />
      <h3
        className={cn(
          "mt-5 font-display font-semibold tracking-[-0.03em] text-[#F2FBFB]",
          wide ? "text-[34px] leading-[38px] lg:text-[48px] lg:leading-[52px]" : "text-[32px] leading-[36px] lg:text-[38px] lg:leading-[42px]",
        )}
      >
        {product.name}
      </h3>
      <p className="mt-3 max-w-[44ch] text-[16px] leading-[26px] text-[#B5C7CA] lg:text-[17px] lg:leading-[28px]">
        {product.body}
      </p>
      <div className={wide ? "pt-9" : "mt-auto pt-8"}>
        <Button
          href={product.cta.href}
          variant="primary"
          icon="external"
          ariaLabel={`${product.cta.label}: ${product.name} (opens in a new tab)`}
          className="static after:absolute after:inset-0 after:rounded-[24px] after:content-[''] [&>svg]:transition-transform group-hover:[&>svg]:translate-x-1 group-hover:[&>svg]:-translate-y-1"
        >
          {product.cta.label}
        </Button>
      </div>
    </>
  );
}

/** Two-tone economy spine between the human row and the agent row; labels are the audience values. */
function EconomyDivider({ human, agent }: { human: string; agent: string }) {
  return (
    <div aria-hidden className="eco-fade flex items-center gap-3 py-2 sm:gap-5" style={{ "--eco-d": 520 } as React.CSSProperties}>
      <AudienceBadge label={human} agent={false} icon="up" />
      <div className="relative h-px flex-1">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="eco-draw-x absolute inset-0"
            style={
              {
                background: "linear-gradient(90deg, #3DF5B0, #00C6C9 45%, #00C6C9 55%, #9B7BFF)",
                "--eco-d": 640,
              } as React.CSSProperties
            }
          />
          <div
            className="eco-anim eco-travel-x absolute inset-y-[-1px] left-0 w-1/6"
            style={{ background: "linear-gradient(90deg, transparent, #F2FBFB, transparent)" }}
          />
        </div>
        {/* soft bloom under the line */}
        <div
          className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 opacity-60 blur-[14px]"
          style={{ background: "linear-gradient(90deg, rgba(61,245,176,0.35), rgba(0,198,201,0.25), rgba(155,123,255,0.40))" }}
        />
        {/* centre node where the two economies meet */}
        <span
          className="eco-anim eco2-node absolute left-1/2 top-1/2 -ml-[5px] -mt-[5px] size-[10px] rounded-[2px]"
          style={{
            background: "linear-gradient(135deg, #3DF5B0, #00C6C9 50%, #9B7BFF)",
            boxShadow: "0 0 0 4px rgba(0,198,201,0.15), 0 0 18px rgba(0,198,201,0.8)",
          }}
        />
      </div>
      <AudienceBadge label={agent} agent icon="down" />
    </div>
  );
}

/** Split colour field: the human row sits in a mint/teal light, the agent row in violet. */
function EcoBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ maskImage: "radial-gradient(70% 60% at 50% 55%, #000 20%, transparent 80%)" }}>
        <div className="eco-anim eco-grid absolute -inset-[64px]" />
      </div>
      <div
        className="eco-anim eco-drift-a absolute -left-[10%] top-[14%] size-[760px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(61,245,176,0.10), rgba(0,198,201,0.05) 55%, transparent)" }}
      />
      <div
        className="eco-anim eco-drift-b absolute right-[-8%] top-[22%] size-[620px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.10), transparent)" }}
      />
      <div
        className="eco-anim eco-drift-a absolute bottom-[-6%] right-[0%] size-[900px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.13), rgba(155,123,255,0.04) 60%, transparent)", animationDelay: "-11s" }}
      />
    </div>
  );
}

/**
 * §4 Ecosystem: a bento of three product worlds. Row one is the human economy (Idlemine 7 cols,
 * Idle Games 5 cols), row two the AI economy (Agent Games, full width, side by side). A two-tone
 * spine labelled with the audience values separates the economies. The whole card is clickable via
 * the CTA's stretched ::after; everything opens in a new tab.
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

          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 lg:mt-14 lg:gap-6">
            {[idlemine, idleGames].map(
              (p, i) =>
                p && (
                  <li
                    key={p.name}
                    className={cn("eco-rise", i === 0 ? "md:col-span-6 lg:col-span-7" : "md:col-span-6 lg:col-span-5")}
                    style={{ "--eco-d": 120 + i * 160, "--eco-base": 120 + i * 160 } as React.CSSProperties}
                  >
                    <TiltCard world={worldOf(p)} spin={i ? "b" : "a"}>
                      <div className="relative h-[260px] sm:h-[320px] lg:h-[350px]">
                        <Art product={p} />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-6 pb-6 pt-1 sm:px-8 sm:pb-8">
                        <CardText product={p} />
                      </div>
                    </TiltCard>
                  </li>
                ),
            )}

            <li aria-hidden className="md:col-span-12 md:py-1">
              <EconomyDivider human={human} agent={ai} />
            </li>

            {agentGames && (
              <li
                className="eco-rise md:col-span-12"
                style={{ "--eco-d": 560, "--eco-base": 600 } as React.CSSProperties}
              >
                <TiltCard world="violet" spin="c" className="md:grid md:grid-cols-12">
                  <div className="relative h-[280px] sm:h-[340px] md:order-2 md:col-span-7 md:h-[400px] lg:h-[460px]">
                    <Art product={agentGames} />
                  </div>
                  <div className="flex flex-1 flex-col items-start px-6 pb-6 pt-1 sm:px-8 sm:pb-8 md:order-1 md:col-span-5 md:justify-center md:py-10 md:pl-10 md:pr-0 lg:py-14 lg:pl-14">
                    <CardText product={agentGames} wide />
                  </div>
                </TiltCard>
              </li>
            )}
          </ul>
        </Container>
      </EcoStage>
    </Section>
  );
}
