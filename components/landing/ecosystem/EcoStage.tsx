"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion host for the Ecosystem section.
 * - `data-play` pauses every CSS loop inside while the section is off-screen.
 * - `data-eco` drives the one-shot entrance: SSR renders "idle" (fully visible, no-JS safe); on mount,
 *   if the section is still below the fold it is "armed" (hidden) and flips to "in" on first intersect.
 * Not positioned on purpose, so the absolute background inside binds to the <section>.
 */
export function EcoStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState<"on" | "off">("off");
  const [eco, setEco] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current?.closest("section") ?? ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = el.getBoundingClientRect();
    const below = r.top > window.innerHeight * 0.85;
    if (!reduce && below) setEco("armed");

    let entered = !below;
    const loops = new IntersectionObserver(
      ([e]) => setPlay(e?.isIntersecting ? "on" : "off"),
      { rootMargin: "120px 0px" },
    );
    const entrance = new IntersectionObserver(
      ([e]) => {
        if (!entered && e?.isIntersecting) {
          entered = true;
          setEco("in");
          entrance.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );
    loops.observe(el);
    if (!entered) entrance.observe(el);
    return () => {
      loops.disconnect();
      entrance.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="eco-stage" data-play={play} data-eco={eco}>
      {children}
    </div>
  );
}
