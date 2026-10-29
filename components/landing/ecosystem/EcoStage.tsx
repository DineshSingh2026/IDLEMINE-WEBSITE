"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion host for the Ecosystem section.
 * - `data-play` pauses every CSS loop inside while the section is off-screen.
 * - `data-eco` drives the one-shot entrance: SSR renders "idle" (fully visible, no-JS safe); on mount,
 *   if the section is still below the fold it is "armed" (hidden) and flips to "in" on first intersect.
 * - Scroll parallax: every descendant marked `data-depth="<px>"` slides vertically by up to that many
 *   px as its card crosses the viewport (transform only, rAF-batched, only while on screen, never
 *   under reduced motion). Positive depth = nearer layer, moves more.
 * Not positioned on purpose, so the absolute background inside binds to the <section>.
 */
export function EcoStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState<"on" | "off">("off");
  const [eco, setEco] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const host = ref.current;
    const el = host?.closest("section") ?? host;
    if (!el || !host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = el.getBoundingClientRect();
    const below = r.top > window.innerHeight * 0.85;
    if (!reduce && below) setEco("armed");

    // parallax layers grouped by their card, so each card's art moves around its own centre
    const groups = new Map<Element, { n: HTMLElement; d: number }[]>();
    if (!reduce) {
      host.querySelectorAll<HTMLElement>("[data-depth]").forEach((n) => {
        const key = n.closest("article") ?? host;
        const list = groups.get(key) ?? [];
        list.push({ n, d: Number(n.dataset.depth) || 0 });
        groups.set(key, list);
      });
    }

    let visible = false;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      groups.forEach((list, card) => {
        const b = card.getBoundingClientRect();
        // -1 when the card centre is a viewport below centre, +1 when a viewport above
        const p = Math.max(-1, Math.min(1, (vh / 2 - (b.top + b.height / 2)) / vh));
        for (const { n, d } of list) n.style.transform = `translate3d(0, ${(p * d).toFixed(2)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (visible && !raf && groups.size) raf = requestAnimationFrame(update);
    };

    let entered = !below;
    const loops = new IntersectionObserver(
      ([e]) => {
        visible = !!e?.isIntersecting;
        setPlay(visible ? "on" : "off");
        onScroll();
      },
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      loops.disconnect();
      entrance.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="eco-stage" data-play={play} data-eco={eco}>
      {children}
    </div>
  );
}
