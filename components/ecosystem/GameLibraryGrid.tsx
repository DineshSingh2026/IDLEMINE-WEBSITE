"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { games, type GameTag } from "@/data/content/site";
import { library } from "@/data/content/ecosystem";
import { cn } from "@/lib/utils";

type Filter = "all" | GameTag;


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
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
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
                "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 ease-out",
                active ? "border-transparent text-[#05080A]" : "border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${pillId}-pill`}
                  className="absolute inset-0 -z-0 rounded-full bg-teal-500"
                  transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
                />
              )}
              <span className="relative">{o.label}</span>
              <span
                className={cn(
                  "relative font-mono text-[11px] tabular-nums",
                  active ? "text-[#05080A]/60" : "text-ink-3",
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
              initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={library.tileLabel(g.title)}
                className="group relative block h-full overflow-hidden rounded-[20px] border border-line bg-surface transition-colors duration-200 ease-out hover:border-line-strong"
              >
                <div className="relative aspect-[960/498] overflow-hidden">
                  <Image
                    src={g.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  <span
                    aria-hidden
                    className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-[8px] border border-line bg-bg/80 text-ink opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <div className="flex flex-col items-start gap-2 px-3 pb-3.5 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:pb-4">
                  <span className="font-display text-[15px] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-base">
                    {g.title}
                  </span>
                  <span className="inline-flex h-6 items-center rounded-full border border-line bg-surface-2 px-2.5 font-mono text-[11px] text-ink-3">
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
