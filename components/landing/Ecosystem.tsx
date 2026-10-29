import { ecosystem, header } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AgentGamesArt, ArtFrame, IdleGamesArt, IdlemineArt } from "./ecosystem/ProductArt";

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

/**
 * §4 Ecosystem — three product paths. Human products carry a mint dot, the agent product a violet
 * one; a thin gradient-economies hairline separates the two economies (the one place both meet).
 * The whole card is clickable via the button's stretched ::after; everything opens in a new tab.
 */
export function Ecosystem() {
  return (
    <Section id={ecosystem.id} ariaLabelledby="ecosystem-title">
      <div className="max-w-[880px]">
        <Eyebrow className="mb-5 text-teal-400">{header.menus[1]?.label}</Eyebrow>
        <Heading id="ecosystem-title" size="l">
          {ecosystem.title}
        </Heading>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ecosystem.products.map((p) => {
          const agent = p.tone === "violet";
          return (
            <li key={p.name} className={cn("relative", agent && "md:col-span-2 lg:col-span-1")}>
              {agent && (
                <>
                  {/* economies divider: vertical in the desktop gutter, horizontal when stacked */}
                  <span
                    aria-hidden
                    className="absolute -left-[12.5px] bottom-[12%] top-[12%] hidden w-px lg:block"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent, #00C6C9 30%, #9B7BFF 70%, transparent)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -top-[12.5px] left-[10%] right-[10%] h-px lg:hidden"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #00C6C9 30%, #9B7BFF 70%, transparent)",
                    }}
                  />
                </>
              )}
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 transition-colors duration-[250ms] ease-out hover:border-line-strong focus-within:border-line-strong",
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
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
