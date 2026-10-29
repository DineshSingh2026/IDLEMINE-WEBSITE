"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { games, type GameTag } from "@/data/content/site";
import { library } from "@/data/content/ecosystem";
import { EASE } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Filter = "all" | GameTag;

const TAG_DOT: Record<GameTag, string> = {
  Puzzle: "bg-cyan",
  Instant: "bg-gold",
  Board: "bg-mint",
  Arcade: "bg-[#FF6B9A]",
  Cards: "bg-violet",
  Table: "bg-[#5AA9FF]",
};

/** Filterable grid of every live game. Every tile opens IdleMine Games in a new tab. */
export function GameLibraryGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const reduce = useReducedMotion();
  const pillId = useId();

  const tags = useMemo(() => {
    const seen: GameTag[] = [];
    for (const g of games) if (!seen.includes(g.tag)) seen.push(g.tag);
    return seen;
  }, []);
  const count = (t: Filter) => (t === "all" ? games.length : games.filter((g) => g.tag === t).length);
  const shown = filter === "all" ? games : games.filter((g) => g.tag === filter);

  const options: Array<{ key: Filter; label: string }> = [
    { key: "all", label: library.allLabel },
    ...tags.map((t) => ({ key: t, label: t })),
  ];

  return (
    <LayoutGroup>
      <div
        role="toolbar"
        aria-label={library.filterLabel}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {options.map((o) => {
          const active = filter === o.key;
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(o.key)}
              className={cn(
                "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300 ease-quint",
                active ? "border-transparent text-[#0B0B0F]" : "border-line bg-white/[0.03] text-ink-2 hover:border-line-strong hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${pillId}-pill`}
                  className="absolute inset-0 -z-0 rounded-full bg-gold shadow-[0_8px_32px_-8px_rgba(245,197,66,0.6)]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">{o.label}</span>
              <span
                className={cn(
                  "relative font-mono text-[11px] tabular-nums",
                  active ? "text-[#0B0B0F]/60" : "text-ink-3",
                )}
              >
                {count(o.key)}
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((g) => (
            <motion.li
              key={g.title}
              layout={!reduce}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={library.tileLabel(g.title)}
                className="group relative block overflow-hidden rounded-lg border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-quint hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-24px_rgba(245,197,66,0.35)]"
              >
                <div className="relative aspect-[960/498] overflow-hidden">
                  <Image
                    src={g.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-quint group-hover:scale-[1.07]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  <span
                    aria-hidden
                    className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full border border-white/15 bg-black/50 text-ink opacity-0 backdrop-blur-md transition-all duration-500 ease-quint group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 pb-3.5 pt-2.5 sm:px-4 sm:pb-4">
                  <span className="font-display text-[15px] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-base">
                    {g.title}
                  </span>
                  <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-2.5 text-[11px] font-medium text-ink-2">
                    <span aria-hidden className={cn("size-1.5 rounded-full", TAG_DOT[g.tag])} />
                    {g.tag}
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
