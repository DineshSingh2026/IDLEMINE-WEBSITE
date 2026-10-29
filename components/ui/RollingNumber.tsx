"use client";

import { useEffect, useRef, useState } from "react";
import { formatters, type StatFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** One odometer wheel: a 0–9 strip translated to the current digit, so it rolls up or down. */
function Wheel({ d }: { d: number }) {
  return (
    <span className="relative inline-block h-[1.15em] w-[1ch] overflow-hidden">
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[1100ms] ease-quint motion-reduce:transition-none"
        style={{ transform: `translateY(${-d * 1.15}em)` }}
      >
        {DIGITS.map((n) => (
          <span key={n} className="block h-[1.15em] text-center leading-[1.15em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Live market number with odometer digits: every real update rolls each digit to its new value
 * and pulses gold. Values are only ever real API data — nothing is simulated between updates.
 */
export function RollingNumber({
  value,
  format,
  className,
}: {
  value: number | null | undefined;
  format: StatFormat;
  className?: string;
}) {
  const text = formatters[format](value);
  const prev = useRef(text);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (prev.current !== text) {
      prev.current = text;
      setPulse((p) => p + 1);
    }
  }, [text]);

  const chars = text.split("");
  return (
    <span className={cn("relative inline-flex tabular-nums", className)}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        key={pulse}
        className={cn("inline-flex h-[1.15em] items-start leading-[1.15em]", pulse > 0 && "stat-flash")}
      >
        {chars.map((ch, i) => {
          // Key from the right so wheels keep their place when the string length changes.
          const k = chars.length - i;
          return /\d/.test(ch) ? (
            <Wheel key={`d${k}`} d={Number(ch)} />
          ) : (
            <span key={`c${k}-${ch}`} className="inline-block h-[1.15em]">
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
}
