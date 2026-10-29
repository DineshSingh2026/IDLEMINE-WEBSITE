"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * One odometer wheel that only ever rolls forward: 7 → 2 travels 7 → 8 → 9 → 0 → 1 → 2 on a doubled
 * strip, then snaps (without transition) back to the first copy. The digit tints teal while it moves.
 */
function Wheel({ d, ms }: { d: number; ms: number }) {
  const posRef = useRef(d);
  const [pos, setPos] = useState(d);
  const [snap, setSnap] = useState(false);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const cur = posRef.current;
    if (cur % 10 === d) return;
    // Nearest position at or after the current one (which may still be on the second copy mid-roll).
    const next = d >= cur ? d : d + 10;
    posRef.current = next;
    setSnap(false);
    setRolling(true);
    setPos(next);
  }, [d]);

  const onEnd = () => {
    setRolling(false);
    if (posRef.current >= 10) {
      posRef.current -= 10;
      setSnap(true);
      setPos(posRef.current);
    }
  };

  return (
    <span className="relative inline-block h-[1.1em] w-[1ch] overflow-hidden">
      <span
        className={cn(
          "absolute inset-x-0 top-0 flex flex-col motion-reduce:transition-none",
          rolling ? "text-teal-300" : "text-inherit",
        )}
        style={{
          transform: `translate3d(0, ${-pos * 1.1}em, 0)`,
          transition: snap
            ? "none"
            : `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1), color ${ms}ms ease-out`,
        }}
        onTransitionEnd={(e) => e.propertyName === "transform" && onEnd()}
      >
        {STRIP.map((n, i) => (
          <span key={i} className="block h-[1.1em] text-center leading-[1.1em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Per-digit rolling counter for values that change every second (e.g. a running total).
 * - `rolling=false` renders the plain string (SSR, count-up phase, reduced motion) — same box size.
 * - Width is reserved by an invisible copy of `reserve` (defaults to the text) with tabular figures, so
 *   ticking never shifts layout.
 */
export function LiveCounter({
  text,
  rolling,
  reserve,
  ms = 700,
  className,
}: {
  text: string;
  rolling: boolean;
  reserve?: string;
  ms?: number;
  className?: string;
}) {
  const chars = text.split("");
  return (
    <span className={cn("inline-grid tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1 h-[1.1em] leading-[1.1em]">
        {reserve ?? text}
      </span>
      <span aria-hidden className="col-start-1 row-start-1 inline-flex h-[1.1em] items-start leading-[1.1em]">
        {rolling
          ? chars.map((ch, i) => {
              // Keyed from the right so wheels keep their place if the string grows a digit.
              const k = chars.length - i;
              return /\d/.test(ch) ? (
                <Wheel key={`d${k}`} d={Number(ch)} ms={ms} />
              ) : (
                <span key={`c${k}`} className="inline-block">
                  {ch}
                </span>
              );
            })
          : text}
      </span>
    </span>
  );
}
