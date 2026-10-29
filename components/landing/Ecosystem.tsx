import { ecosystem, header } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AgentGamesArt, ArtFrame, IdleGamesArt, IdlemineArt } from "./ecosystem/ProductArt";
import { EcoStage } from "./ecosystem/EcoStage";
import { TiltCard } from "./ecosystem/TiltCard";

type Product = (typeof ecosystem.products)[number];

function Art({ product }: { product: Product }) {
  switch (product.name) {
    case "Idlemine":
      return <IdlemineArt images={product.images} />;
    case "Idle Games":
      return <IdleGamesArt logo={product.images[0]} />;
    default:
      return <AgentGamesArt images={product.images} />;
  }
}

/** Very faint drifting grid + two slow light pools; ~all neutral, masked to the section centre. */
function EcoBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ maskImage: "radial-gradient(70% 60% at 50% 55%, #000 20%, transparent 80%)" }}
      >
        <div className="eco-anim eco-grid absolute -inset-[64px]" />
      </div>
      <div
        className="eco-anim eco-drift-a absolute left-[8%] top-[30%] size-[520px] rounded-full opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(0,198,201,0.07), transparent)" }}
      />
      <div
        className="eco-anim eco-drift-b absolute right-[4%] top-[40%] size-[460px] rounded-full opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.06), transparent)" }}
      />
    </div>
  );
}

const ECONOMIES_V = "linear-gradient(180deg, transparent, #00C6C9 30%, #9B7BFF 70%, transparent)";
const ECONOMIES_H = "linear-gradient(90deg, transparent, #00C6C9 30%, #9B7BFF 70%, transparent)";

/**
 * §4 Ecosystem — three product paths. Human products carry a mint dot, the agent product a violet
 * one; a thin gradient-economies hairline separates the two economies (the one place both meet).
 * The whole card is clickable via the button's stretched ::after; everything opens in a new tab.
 * Motion: cards rise in with a stagger, the divider draws in, each card tilts toward the cursor with a
 * spotlight + rotating hairline, and each artwork is a slow CSS loop (see ecosystem/ecosystem.css).
 */
export function Ecosystem() {
  return (
    <Section id={ecosystem.id} ariaLabelledby="ecosystem-title" bare>
      <EcoStage>
        <EcoBackground />
        <Container>
          <div className="max-w-[880px]">
            <div className="eco-fade">
              <Eyebrow className="mb-5 text-teal-400">{header.menus[1]?.label}</Eyebrow>
            </div>
            <Heading id="ecosystem-title" size="l">
              {ecosystem.title}
            </Heading>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ecosystem.products.map((p, i) => {
              const agent = p.tone === "violet";
              return (
                <li
                  key={p.name}
                  className={cn("eco-rise relative", agent && "md:col-span-2 lg:col-span-1")}
                  style={{ "--eco-d": 120 + i * 130 } as React.CSSProperties}
                >
                  {agent && (
                    <>
                      {/* economies divider: vertical in the desktop gutter, horizontal when stacked */}
                      <span
                        aria-hidden
                        className="absolute -left-[12.5px] bottom-[12%] top-[12%] hidden w-px overflow-hidden lg:block"
                      >
                        <span
                          className="eco-draw-y absolute inset-0"
                          style={{ background: ECONOMIES_V, "--eco-d": 420 } as React.CSSProperties}
                        />
                        <span
                          className="eco-anim eco-travel-y absolute inset-x-0 top-0 h-1/6"
                          style={{ background: "linear-gradient(180deg, transparent, #E9E2FF, transparent)" }}
                        />
                      </span>
                      <span
                        aria-hidden
                        className="absolute -top-[12.5px] left-[10%] right-[10%] h-px overflow-hidden lg:hidden"
                      >
                        <span
                          className="eco-draw-x absolute inset-0"
                          style={{ background: ECONOMIES_H, "--eco-d": 420 } as React.CSSProperties}
                        />
                        <span
                          className="eco-anim eco-travel-x absolute inset-y-0 left-0 w-1/6"
                          style={{ background: "linear-gradient(90deg, transparent, #E9E2FF, transparent)" }}
                        />
                      </span>
                    </>
                  )}
                  <TiltCard
                    tone={agent ? "violet" : "mint"}
                    spin={(["a", "b", "c"] as const)[i % 3]}
                    className={cn(
                      // tablet: the full-width agent card lays out side by side
                      agent && "md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:items-center md:max-lg:gap-8",
                    )}
                  >
                    <ArtFrame tone={agent ? "violet" : "mint"}>
                      <Art product={p} />
                    </ArtFrame>

                    <div
                      className={cn(
                        "mt-7 flex flex-1 flex-col",
                        agent && "md:max-lg:mt-0 md:max-lg:h-full md:max-lg:py-2",
                      )}
                    >
                      <p className="inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase leading-4 tracking-[0.08em] text-ink-2">
                        <span
                          aria-hidden
                          className={cn("size-1.5 rounded-full", agent ? "bg-violet" : "bg-mint")}
                        />
                        {p.audience}
                      </p>
                      <h3 className="mt-3 text-heading-m text-ink">{p.name}</h3>
                      <p className="mt-3 max-w-[40ch] text-[16px] leading-[26px] text-ink-2">{p.body}</p>
                      <div className="mt-auto pt-8">
                        <Button
                          href={p.cta.href}
                          variant="secondary"
                          icon="external"
                          ariaLabel={`${p.cta.label}: ${p.name} (opens in a new tab)`}
                          className="static after:absolute after:inset-0 after:rounded-[20px] after:content-['']"
                        >
                          {p.cta.label}
                        </Button>
                      </div>
                    </div>
                  </TiltCard>
                </li>
              );
            })}
          </ul>
        </Container>
      </EcoStage>
    </Section>
  );
}
