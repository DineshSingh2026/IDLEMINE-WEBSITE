"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrainCircuit, ChartNoAxesColumn, Gamepad2, ShieldCheck, UserRound, Wallet, type LucideIcon } from "lucide-react";
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

type Tone = "gold" | "violet" | "mint" | "white";
const META: Record<AgentNodeId, { icon: LucideIcon; tone: Tone }> = {
  executive: { icon: BrainCircuit, tone: "gold" },
  gaming: { icon: Gamepad2, tone: "violet" },
  reporting: { icon: ChartNoAxesColumn, tone: "mint" },
  wallet: { icon: Wallet, tone: "gold" },
  you: { icon: UserRound, tone: "white" },
};

// Active-state styling per tone (driven by data-active on the node wrapper).
const TONE: Record<Tone, { card: string; tile: string; glow: string; hex: string }> = {
  gold: {
    card: "group-data-[active=true]/n:border-gold/45",
    tile: "group-data-[active=true]/n:border-gold/50 group-data-[active=true]/n:bg-gold/15 group-data-[active=true]/n:text-gold",
    glow: "rgba(0,198,201,0.30)",
    hex: "#00C6C9",
  },
  violet: {
    card: "group-data-[active=true]/n:border-violet/55",
    tile: "group-data-[active=true]/n:border-violet/60 group-data-[active=true]/n:bg-violet/20 group-data-[active=true]/n:text-[#C4B2FF]",
    glow: "rgba(155,123,255,0.34)",
    hex: "#9B7BFF",
  },
  mint: {
    card: "group-data-[active=true]/n:border-mint/45",
    tile: "group-data-[active=true]/n:border-mint/50 group-data-[active=true]/n:bg-mint/15 group-data-[active=true]/n:text-mint",
    glow: "rgba(61,245,176,0.26)",
    hex: "#3DF5B0",
  },
  white: {
    card: "group-data-[active=true]/n:border-white/35",
    tile: "group-data-[active=true]/n:border-white/40 group-data-[active=true]/n:bg-white/10 group-data-[active=true]/n:text-ink",
    glow: "rgba(77,217,219,0.28)",
    hex: "#4DD9DB",
  },
};

/** Signal route, in lighting order: Executive → Gaming, → Reporting, → Wallet, Wallet → You. */
const LINKS: Array<[AgentNodeId, AgentNodeId]> = [
  ["executive", "gaming"],
  ["executive", "reporting"],
  ["executive", "wallet"],
  ["wallet", "you"],
];

type NodeCopy = (typeof agentic.nodes)[number];
const node = (id: AgentNodeId) => agentic.nodes.find((n) => n.id === id) as NodeCopy;
const num = (id: AgentNodeId) => String(agentic.nodes.findIndex((n) => n.id === id) + 1).padStart(2, "0");

/* ───────── Node cards ───────── */
function NodeShell({ id, className, children }: { id: AgentNodeId; className?: string; children: React.ReactNode }) {
  const t = TONE[META[id].tone];
  return (
    <div data-node={id} data-active="true" className={cn("group/n relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[40px] opacity-0 blur-2xl transition-opacity duration-700 ease-quint group-data-[current=true]/n:opacity-100"
        style={{ background: `radial-gradient(closest-side, ${t.glow}, transparent)` }}
      />
      <div
        className={cn(
          "relative h-full rounded-[20px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(22,25,37,0.92),rgba(12,13,22,0.92))] opacity-40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-[opacity,border-color] duration-700 ease-quint",
          "group-data-[active=true]/n:opacity-100",
          t.card,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Tile({ id, size = "md" }: { id: AgentNodeId; size?: "md" | "lg" }) {
  const Icon = META[id].icon;
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-ink-3 transition-colors duration-700 ease-quint",
        size === "lg" ? "size-12 rounded-2xl" : "size-10 rounded-xl",
        id === "you" && "rounded-full",
        TONE[META[id].tone].tile,
      )}
    >
      <Icon className={size === "lg" ? "size-[22px]" : "size-[18px]"} strokeWidth={1.75} />
    </span>
  );
}

function Num({ id }: { id: AgentNodeId }) {
  return (
    <span
      aria-hidden
      className="font-mono text-[11px] tracking-[0.1em] text-ink-3 transition-colors duration-700 group-data-[active=true]/n:text-gold-2"
    >
      {num(id)}
    </span>
  );
}

/* ───────── Diagram ───────── */
function Diagram({ stageRef, pathRefs, sparkRef }: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  pathRefs: React.RefObject<Array<SVGPathElement | null>>;
  sparkRef: React.RefObject<SVGGElement | null>;
}) {
  const [geo, setGeo] = useState<{ w: number; h: number; d: string[] } | null>(null);

  // Connector curves are measured from the real card positions, so they always meet the cards.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const s = stage.getBoundingClientRect();
    const box = (id: AgentNodeId) => stage.querySelector<HTMLElement>(`[data-node="${id}"]`)?.getBoundingClientRect();
    const d = LINKS.map(([a, b]) => {
      const A = box(a);
      const B = box(b);
      if (!A || !B) return "";
      const x1 = A.left + A.width / 2 - s.left;
      const y1 = A.bottom - s.top;
      const x2 = B.left + B.width / 2 - s.left;
      const y2 = B.top - s.top;
      const k = (y2 - y1) * 0.55;
      return `M${x1},${y1} C${x1},${y1 + k} ${x2},${y2 - k} ${x2},${y2}`;
    });
    setGeo({ w: s.width, h: s.height, d });
  }, [stageRef]);

  useIsoLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const ex = node("executive");
  const you = node("you");

  return (
    <div ref={stageRef} className="relative mx-auto w-full max-w-[720px]">
      {geo && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          <defs>
            <radialGradient id="ae-spark">
              <stop offset="0%" stopColor="#E6FBFB" />
              <stop offset="35%" stopColor="#4DD9DB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00C6C9" stopOpacity="0" />
            </radialGradient>
            <filter id="ae-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            {LINKS.map(([, b], i) => (
              <linearGradient key={i} id={`ae-g${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                <stop offset="0%" stopColor="#4DD9DB" />
                <stop offset="100%" stopColor={TONE[META[b].tone].hex} />
              </linearGradient>
            ))}
          </defs>
          {geo.d.map((d, i) => (
            <g key={i}>
              {/* track */}
              <path d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />
              {/* lit: glow + core (dash-offset driven) */}
              <path
                data-glow={i}
                d={d}
                fill="none"
                stroke={`url(#ae-g${i})`}
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#ae-blur)"
                opacity="0.6"
              />
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                stroke={`url(#ae-g${i})`}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          ))}
          <g ref={sparkRef} style={{ opacity: 0 }}>
            <circle r="16" fill="url(#ae-spark)" />
            <circle r="3" fill="#E6FBFB" />
          </g>
        </svg>
      )}

      {/* Row 1 — executive */}
      <NodeShell id="executive" className="mx-auto w-full max-w-[380px]">
        <div className="flex items-center gap-4 p-5">
          <Tile id="executive" size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[19px] font-semibold tracking-[-0.015em] text-ink">{ex.title}</p>
              <Num id="executive" />
            </div>
            <p className="mt-1 text-[14px] leading-snug text-ink-2">
              <GoldText text={ex.body} />
            </p>
          </div>
        </div>
      </NodeShell>

      {/* Row 2 — sub-agents */}
      <div className="mt-20 grid grid-cols-3 gap-4 xl:gap-5">
        {(["gaming", "reporting", "wallet"] as const).map((id) => {
          const n = node(id);
          return (
            <NodeShell key={id} id={id}>
              <div className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <Tile id={id} />
                  <Num id={id} />
                </div>
                <p className="mt-5 font-display text-[17px] font-semibold tracking-[-0.015em] text-ink">{n.title}</p>
                <p className="mt-1 text-[14px] leading-snug text-ink-2">
                  <GoldText text={n.body} />
                </p>
              </div>
            </NodeShell>
          );
        })}
      </div>

      {/* Row 3 — the human. Sits under the wallet: withdrawals need you. */}
      <div className="mt-16 grid grid-cols-3 gap-4 xl:gap-5">
        <NodeShell id="you" className="col-span-2 col-start-2 justify-self-end">
          <div className="flex items-center gap-4 rounded-full py-3 pl-3 pr-6">
            <Tile id="you" />
            <p className="text-[15px] text-ink-2">
              <strong className="font-semibold text-ink">{you.title}</strong> {you.body}
            </p>
            <ShieldCheck
              aria-hidden
              className="size-[18px] shrink-0 text-ink-3 transition-colors duration-700 group-data-[active=true]/n:text-mint"
              strokeWidth={1.75}
            />
          </div>
        </NodeShell>
      </div>
    </div>
  );
}

export function AgenticEconomy() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const sparkRef = useRef<SVGGElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(1);

  // Draw state for progress p ∈ [0,1]: each link takes a quarter; a node lights when its link lands.
  const render = useCallback((p: number) => {
    progress.current = p;
    const stage = stageRef.current;
    if (!stage) return;
    const s = p * LINKS.length;
    const order: AgentNodeId[] = ["executive", "gaming", "reporting", "wallet", "you"];
    let current = 0; // the executive is always on — it starts the signal

    LINKS.forEach((_, i) => {
      const path = pathRefs.current[i];
      const glow = stage.querySelector<SVGPathElement>(`[data-glow="${i}"]`);
      const t = Math.min(1, Math.max(0, s - i));
      if (path) {
        const L = path.getTotalLength();
        for (const el of [path, glow]) {
          if (!el) continue;
          el.style.strokeDasharray = `${L}`;
          el.style.strokeDashoffset = `${L * (1 - t)}`;
        }
        if (t > 0 && t < 1 && sparkRef.current) {
          const pt = path.getPointAtLength(L * t);
          sparkRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        }
      }
      if (t >= 1) current = i + 1;
    });
    if (sparkRef.current) sparkRef.current.style.opacity = s > 0.01 && s < LINKS.length - 0.01 ? "1" : "0";

    order.forEach((id, i) => {
      const el = stage.querySelector(`[data-node="${id}"]`);
      el?.setAttribute("data-active", String(i <= current));
      el?.setAttribute("data-current", String(i === current));
    });
    const c = Math.max(0, current);
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (countRef.current) countRef.current.textContent = String(c + 1).padStart(2, "0");
    if (labelRef.current) labelRef.current.textContent = node(order[c]).title;
  }, []);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Re-apply after the SVG paths mount / re-measure.
    const ro = new ResizeObserver(() => render(progress.current));
    if (stageRef.current) ro.observe(stageRef.current);

    const mm = gsap.matchMedia();
    mm.add({ wide: "(min-width: 1280px) and (min-height: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (c) => {
      const { wide, reduce } = c.conditions as { wide: boolean; reduce: boolean };
      if (!wide || reduce) {
        render(1);
        return;
      }
      const state = { p: 0 };
      render(0);
      gsap
        .timeline({
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
        })
        .to(state, { p: 1, duration: 1, onUpdate: () => render(state.p) })
        .to({}, { duration: 0.15 });
      return () => render(1);
    });
    return () => {
      ro.disconnect();
      mm.revert();
    };
  }, [render]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="agentic-title"
      className="relative isolate overflow-hidden bg-bg-deep py-24 md:py-32 xl:flex xl:min-h-[100svh] xl:items-center xl:py-20"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundBlobs
          speed={0.15}
          blobs={[
            { color: "violet", pos: { top: "45%", left: "68%" }, size: 900, opacity: 0.3 },
            { color: "gold", pos: { top: "12%", left: "62%" }, size: 520, opacity: 0.14 },
            { color: "mint", pos: { top: "88%", left: "18%" }, size: 560, opacity: 0.1 },
          ]}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_70%_at_65%_50%,#000_10%,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <Container className="grid gap-16 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:items-center xl:gap-16">
        {/* Copy */}
        <RevealGroup className="max-w-[560px]">
          <RevealItem>
            <Eyebrow>{agentic.eyebrow}</Eyebrow>
          </RevealItem>
          <Heading id="agentic-title" size="s" className="mt-5">
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

        {/* ≥640px: node diagram (pinned + scrubbed on wide screens, fully lit otherwise) */}
        <figure className="relative hidden sm:block" aria-label={agentic.diagramLabel}>
          <Diagram stageRef={stageRef} pathRefs={pathRefs} sparkRef={sparkRef} />
          <figcaption
            aria-hidden
            className="mx-auto mt-12 flex max-w-[460px] items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3"
          >
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
            <span ref={labelRef} className="w-[130px] truncate text-right text-ink-2">
              {agentic.nodes[agentic.nodes.length - 1].title}
            </span>
          </figcaption>
        </figure>

        {/* <640px: vertical stack, everything visible */}
        <ol aria-label={agentic.diagramLabel} className="relative mx-auto w-full max-w-[460px] space-y-3 sm:hidden">
          <span aria-hidden className="absolute bottom-8 left-[33px] top-8 w-px bg-gradient-to-b from-gold via-violet to-mint opacity-60" />
          {agentic.nodes.map((n) => (
            <li key={n.id} data-active="true" className="group/n relative">
              <div className={cn("relative flex items-center gap-4 rounded-2xl border bg-[#0B1114]/85 p-3 pr-5 backdrop-blur-xl", TONE[META[n.id].tone].card)}>
                <span className="relative bg-bg-deep">
                  <Tile id={n.id} />
                </span>
                <div className="min-w-0 py-0.5">
                  {n.id === "you" ? (
                    <p className="text-[15px] leading-snug text-ink-2">
                      <strong className="font-semibold text-ink">{n.title}</strong> {n.body}
                    </p>
                  ) : (
                    <>
                      <p className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">{n.title}</p>
                      <p className="mt-0.5 text-[14px] leading-snug text-ink-2">
                        <GoldText text={n.body} />
                      </p>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
