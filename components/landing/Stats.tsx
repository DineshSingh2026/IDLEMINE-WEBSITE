import { stats } from "@/data/content/landing";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { CountUp } from "./stats/CountUp";

/**
 * §3 Stats — a calm, Solana-style performance band: five large numbers on one dark panel,
 * separated by hairlines (1px grid gaps over the border colour), each with a short teal rule.
 * Numbers count up once on reveal; SSR always carries the final values.
 */
export function Stats() {
  return (
    <Section ariaLabelledby="stats-title">
      <div className="max-w-[880px]">
        <Heading id="stats-title" size="l">
          {stats.title}
        </Heading>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.35fr)_minmax(0,1.05fr)_minmax(0,0.85fr)_minmax(0,1.2fr)]">
        {stats.items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col bg-surface px-6 pb-7 pt-6 xl:min-h-[260px] xl:pb-8 xl:pt-7",
              // Five tiles on a two-up tablet grid: the last one spans the row.
              i === stats.items.length - 1 && "md:col-span-2 xl:col-span-1",
            )}
          >
            <span aria-hidden className="block h-[2px] w-8 rounded-full bg-teal-400" />
            <p className="mt-10 whitespace-nowrap font-display font-semibold leading-none tracking-[-0.035em] text-ink text-[48px] md:text-[56px] xl:mt-auto xl:text-[clamp(34px,3vw,48px)]">
              <CountUp value={item.value} format={item.format} />
              {item.format === "millions" && (
                <>
                  {" "}
                  <span className="align-baseline text-[0.42em] font-medium tracking-[-0.01em] text-ink-2">
                    Million
                  </span>
                </>
              )}
            </p>
            <p className="mt-4 max-w-[24ch] text-[14px] leading-5 text-ink-2 xl:min-h-[60px]">{item.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 font-mono text-[12px] leading-5 tracking-[0.02em] text-ink-3">{stats.source}</p>
    </Section>
  );
}
