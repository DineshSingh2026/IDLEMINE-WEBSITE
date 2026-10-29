"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrainCircuit, ChartNoAxesColumn, Gamepad2, UserRound, Wallet, type LucideIcon } from "lucide-react";
import { agentic, type AgentNodeId } from "@/data/content/home";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { GoldText } from "./GoldText";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ───────── Diagram geometry (viewBox 600 × 680) ───────── */
const VB = { w: 600, h: 680 };
type Tone = "gold" | "violet" | "mint" | "ink";
const NODE: Record<AgentNodeId, { x: number; y: number; icon: LucideIcon; tone: Tone }> = {
  executive: { x: 300, y: 72, icon: BrainCircuit, tone: "gold" },
  gaming: { x: 112, y: 262, icon: Gamepad2, tone: "violet" },
  reporting: { x: 488, y: 262, icon: ChartNoAxesColumn, tone: "mint" },
  wallet: { x: 300, y: 446, icon: Wallet, tone: "gold" },
  you: { x: 300, y: 612, icon: UserRound, tone: "ink" },
};
/** The route the signal travels: Executive → Gaming → Reporting → Wallet → You. */
const ROUTE = "M300,72 C300,176 112,158 112,262 C236,350 364,174 488,262 C488,362 300,346 300,446 L300,612";
/** Faint hierarchy lines (executive oversees every sub-agent). */
const STRUCTURE = ["M300,72 C300,176 488,158 488,262", "M300,72 L300,446"];

const TONE: Record<Tone, { ring: string; tile: string; glow: string }> = {
  gold: {
    ring: "group-data-[active=true]/node:border-gold/50",
    tile: "group-data-[active=true]/node:bg-gold/15 group-data-[active=true]/node:text-gold group-data-[active=true]/node:border-gold/40",
    glow: "rgba(245,197,66,0.45)",
  },
  violet: {
    ring: "group-data-[active=true]/node:border-violet/60",
    tile: "group-data-[active=true]/node:bg-violet/20 group-data-[active=true]/node:text-[#C9A5FF] group-data-[active=true]/node:border-violet/50",
    glow: "rgba(153,69,255,0.5)",
  },
  mint: {
    ring: "group-data-[active=true]/node:border-mint/50",
    tile: "group-data-[active=true]/node:bg-mint/15 group-data-[active=true]/node:text-mint group-data-[active=true]/node:border-mint/40",
    glow: "rgba(20,241,149,0.4)",
  },
  ink: {
    ring: "group-data-[active=true]/node:border-white/40",
    tile: "group-data-[active=true]/node:bg-white/10 group-data-[active=true]/node:text-ink group-data-[active=true]/node:border-white/30",
    glow: "rgba(255,224,138,0.35)",
  },
};

type NodeCopy = (typeof agentic.nodes)[number];

function NodeBody({ node }: { node: NodeCopy }) {
  if (node.id === "you") {
    return (
      <p className="text-[13px] leading-snug text-ink-2">
        <strong className="font-semibold text-ink">{node.title}</strong> {node.body}
      </p>
    );
  }
  return (
    <>
      <p className="font-display text-[15px] font-semibold leading-tight tracking-[-0.01em] text-ink">{node.title}</p>
      <p className="mt-1 text-[13px] leading-snug text-ink-2">
        <GoldText text={node.body} />
      </p>
    </>
  );
}

/* ───────── Desktop diagram node (absolutely positioned over the SVG) ───────── */
function DiagramNode({ node, index }: { node: NodeCopy; index: number }) {
  const g = NODE[node.id];
  const t = TONE[g.tone];
  const Icon = g.icon;
  const isYou = node.id === "you";
  return (
    <div
      data-node={node.id}
      data-active="true"
      className="group/node absolute z-10 w-[31%] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(g.x / VB.w) * 100}%`, top: `${(g.y / VB.h) * 100}%` }}
    >
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[32px] opacity-0 blur-2xl transition-opacity duration-700 ease-quint group-data-[active=true]/node:opacity-100"
        style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)` }}
      />
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0d0f1a]/70 p-3 opacity-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-[opacity,border-color,transform,box-shadow] duration-700 ease-quint",
          "group-data-[active=true]/node:opacity-100 group-data-[current=true]/node:scale-[1.04] group-data-[current=true]/node:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_-20px_rgba(0,0,0,0.8)]",
          t.ring,
          isYou && "rounded-full pr-5",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ink-3 transition-colors duration-700 ease-quint",
            isYou && "rounded-full",
            t.tile,
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <NodeBody node={node} />
        </div>
        <span
          aria-hidden
          className="absolute -top-2 right-3 rounded-full border border-white/10 bg-bg px-1.5 font-mono text-[10px] leading-4 text-ink-3 transition-colors duration-700 group-data-[active=true]/node:text-gold-2"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function AgenticEconomy() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const marchRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const route = routeRef.current;
    const diagram = diagramRef.current;
    if (!section || !route || !diagram) return;

    const L = route.getTotalLength();
    // Length along the route where each node sits (closest sampled point).
    const thresholds = agentic.nodes.map((n) => {
      const { x, y } = NODE[n.id];
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= 400; i++) {
        const pt = route.getPointAtLength((L * i) / 400);
        const d = (pt.x - x) ** 2 + (pt.y - y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i / 400;
        }
      }
      return best;
    });
    const nodeEls = agentic.nodes.map((n) => diagram.querySelector<HTMLElement>(`[data-node="${n.id}"]`));
    const dots = particlesRef.current ? Array.from(particlesRef.current.querySelectorAll<SVGGElement>("g")) : [];
    const trail = [0, 26, 58];

    for (const p of [route, glowRef.current, maskRef.current]) {
      if (!p) continue;
      p.style.strokeDasharray = `${L}`;
    }

    const render = (p: number) => {
      const head = L * p;
      const off = `${L - head}`;
      route.style.strokeDashoffset = off;
      if (glowRef.current) glowRef.current.style.strokeDashoffset = off;
      if (maskRef.current) maskRef.current.style.strokeDashoffset = off;
      if (marchRef.current) marchRef.current.style.strokeDashoffset = `${-p * 520}`;
      dots.forEach((dot, i) => {
        const at = Math.max(0, head - trail[i]);
        const pt = route.getPointAtLength(at);
        dot.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        dot.style.opacity = p <= 0.002 || p >= 0.998 ? "0" : String(1 - i * 0.3);
      });
      let current = 0;
      nodeEls.forEach((el, i) => {
        const on = p >= thresholds[i] - 0.004;
        if (on) current = i;
        el?.setAttribute("data-active", String(on));
      });
      nodeEls.forEach((el, i) => el?.setAttribute("data-current", String(i === current)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (countRef.current) countRef.current.textContent = String(current + 1).padStart(2, "0");
      if (labelRef.current) labelRef.current.textContent = agentic.nodes[current].title;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
        (c) => {
          const { desktop, reduce } = c.conditions as { desktop: boolean; reduce: boolean };
          if (!desktop || reduce) {
            render(1);
            return;
          }
          const state = { p: 0 };
          render(0);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(state, { p: 1, duration: 1, onUpdate: () => render(state.p) }).to({}, { duration: 0.12 });
          return () => render(1);
        },
      );
      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="agentic-title"
      className="relative isolate overflow-hidden bg-bg-deep py-24 md:py-32 lg:flex lg:min-h-[100svh] lg:items-center lg:py-0 lg:pt-[72px]"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundBlobs
          speed={0.15}
          blobs={[
            { color: "violet", pos: { top: "35%", left: "72%" }, size: 820, opacity: 0.32 },
            { color: "gold", pos: { top: "8%", left: "60%" }, size: 520, opacity: 0.16 },
            { color: "mint", pos: { top: "90%", left: "20%" }, size: 560, opacity: 0.12 },
          ]}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_70%_at_70%_50%,#000_10%,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:items-center lg:gap-12">
        {/* Copy */}
        <RevealGroup className="max-w-[540px]">
          <RevealItem>
            <Eyebrow>{agentic.eyebrow}</Eyebrow>
          </RevealItem>
          <Heading id="agentic-title" className="text-display-l mt-5">
            {agentic.title}
          </Heading>
          <RevealItem>
            <p className="text-body-l mt-6">
              <GoldText text={agentic.body1} />
            </p>
          </RevealItem>
          <RevealItem>
            <p className="text-body mt-5">{agentic.body2}</p>
          </RevealItem>
          <RevealItem className="mt-10">
            <Button href={agentic.cta.href}>{agentic.cta.label}</Button>
          </RevealItem>
        </RevealGroup>

        {/* Desktop: scrubbed node diagram */}
        <figure className="relative hidden lg:block" aria-label={agentic.diagramLabel}>
          <div
            ref={diagramRef}
            className="relative mx-auto aspect-[600/680]"
            style={{ width: "min(100%, calc((100svh - 190px) * 600 / 680))" }}
          >
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className="absolute inset-0 size-full overflow-visible"
              role="img"
              aria-labelledby="agentic-desc"
            >
              <desc id="agentic-desc">{agentic.diagramLabel}</desc>
              <defs>
                <linearGradient id="ae-route" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFE08A" />
                  <stop offset="40%" stopColor="#9945FF" />
                  <stop offset="75%" stopColor="#14F195" />
                  <stop offset="100%" stopColor="#F5C542" />
                </linearGradient>
                <radialGradient id="ae-spark">
                  <stop offset="0%" stopColor="#FFF6D6" />
                  <stop offset="35%" stopColor="#FFE08A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F5C542" stopOpacity="0" />
                </radialGradient>
                <filter id="ae-blur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <mask id="ae-drawn" maskUnits="userSpaceOnUse">
                  <path ref={maskRef} d={ROUTE} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
                </mask>
              </defs>

              {/* Orbit rings around the executive */}
              <circle cx={NODE.executive.x} cy={NODE.executive.y} r="120" fill="none" stroke="rgba(255,255,255,0.04)" />
              <circle cx={NODE.executive.x} cy={NODE.executive.y} r="210" fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="2 8" />

              {STRUCTURE.map((d) => (
                <path key={d} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="1 7" strokeLinecap="round" />
              ))}
              {/* Unlit route */}
              <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round" />
              {/* Lit route: glow + core */}
              <path ref={glowRef} d={ROUTE} fill="none" stroke="url(#ae-route)" strokeWidth="8" strokeLinecap="round" filter="url(#ae-blur)" opacity="0.55" />
              <path ref={routeRef} d={ROUTE} fill="none" stroke="url(#ae-route)" strokeWidth="2" strokeLinecap="round" />
              {/* Marching dashes, only on the lit part */}
              <path
                ref={marchRef}
                d={ROUTE}
                fill="none"
                stroke="#fff"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeDasharray="3 13"
                strokeLinecap="round"
                mask="url(#ae-drawn)"
              />
              {/* Particles riding the line */}
              <g ref={particlesRef}>
                {[16, 11, 8].map((r, i) => (
                  <g key={i} style={{ opacity: 0 }}>
                    <circle r={r * 1.8} fill="url(#ae-spark)" />
                    <circle r={r / 4} fill="#FFF8E1" />
                  </g>
                ))}
              </g>
            </svg>

            {agentic.nodes.map((n, i) => (
              <DiagramNode key={n.id} node={n} index={i} />
            ))}
          </div>

          {/* Progress indicator */}
          <figcaption aria-hidden className="mx-auto mt-6 flex max-w-[420px] items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <span className="tabular-nums text-gold-2">
              <span ref={countRef}>05</span>
              <span className="text-ink-3"> / {String(agentic.nodes.length).padStart(2, "0")}</span>
            </span>
            <span className="relative h-px flex-1 overflow-hidden bg-white/10">
              <span
                ref={barRef}
                className="absolute inset-0 origin-left bg-gradient-to-r from-gold via-violet to-mint"
                style={{ transform: "scaleX(1)" }}
              />
            </span>
            <span ref={labelRef} className="w-[120px] truncate text-right text-ink-2">
              {agentic.nodes[agentic.nodes.length - 1].title}
            </span>
          </figcaption>
        </figure>

        {/* Mobile / tablet: vertical stack, everything visible */}
        <RevealGroup className="relative mx-auto w-full max-w-[460px] lg:hidden" stagger={0.07}>
          <ol aria-label={agentic.diagramLabel}>
          <span aria-hidden className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-gold via-violet to-mint opacity-70" />
          {agentic.nodes.map((n) => {
            const g = NODE[n.id];
            const t = TONE[g.tone];
            const Icon = g.icon;
            return (
              <RevealItem as="li" key={n.id} className="relative pb-4 last:pb-0">
                <div data-active="true" className="group/node relative flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d0f1a]/80 p-2.5 pr-5 backdrop-blur-xl">
                  <span
                    aria-hidden
                    className={cn("relative flex size-[34px] shrink-0 items-center justify-center rounded-xl border bg-bg", t.tile)}
                    style={{ boxShadow: `0 0 24px ${t.glow}` }}
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 py-1">
                    <NodeBody node={n} />
                  </div>
                </div>
              </RevealItem>
            );
          })}
          </ol>
        </RevealGroup>
      </Container>
    </section>
  );
}
