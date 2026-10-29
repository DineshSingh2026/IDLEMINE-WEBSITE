"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Agent Games showpiece: a live generative agent arena drawn on one <canvas>.
 * An isometric board of light where three teams of small autonomous agents walk tile to tile,
 * claim territory (Territory Control: tiles flip to the team colour with a pulse) and hunt the
 * pellets that keep spawning (Food Collector). A floating scoreboard, a contest timer ring
 * (a 15 minute round, sped up for display) and the four role agent team constellation sit around it.
 * Every number here is a visual simulation, not data.
 *
 * Perf: one rAF loop, dpr capped at 2, pre rendered glow sprites, paused when off-screen or the tab
 * is hidden. Reduced motion: the simulation is fast forwarded with a fixed seed and drawn once.
 * Depth: the same three transform owners as ProductArt layers (scroll parallax > pointer tilt > entrance).
 */

const N = 11; // board is N x N tiles
const ROUND_SECONDS = 15 * 60;
const ROUND_REAL = 46; // a full 15:00 round plays out in this many real seconds
const STEP = 0.36; // seconds per tile step (base)
const MAX_PELLETS = 9;

type Team = { name: string; hex: string; rgb: string; core: string };
const TEAMS: readonly Team[] = [
  { name: "violet", hex: "#9B7BFF", rgb: "155,123,255", core: "#E9E2FF" },
  { name: "teal", hex: "#00C6C9", rgb: "0,198,201", core: "#D6FBFB" },
  { name: "mint", hex: "#3DF5B0", rgb: "61,245,176", core: "#E2FFF3" },
];
const AGENTS_PER_TEAM = 3;
const ROLES = ["Executive agent", "Gaming", "Reporting", "Wallet"] as const;

/* ───────── deterministic RNG so SSR-less first frame and reduced-motion frame are stable ───────── */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Agent = {
  team: number;
  fx: number; // from tile
  fy: number;
  tx: number; // to tile
  ty: number;
  t: number; // 0..1 progress of the current step
  dur: number;
  px: number; // previous tile (avoid back steps)
  py: number;
  glow: number; // flash after eating
  bob: number;
  aim: number; // index of targeted pellet or -1
  trail: { x: number; y: number }[];
};
type Pellet = { x: number; y: number; born: number; alive: boolean };
type Burst = { x: number; y: number; t0: number; rgb: string };

type Sim = {
  rnd: () => number;
  time: number;
  roundT: number; // real seconds into the round
  owner: Int8Array;
  pulse: Float32Array; // time the tile last flipped
  clearAt: Float32Array; // pending wipe time (round reset), 0 = none
  agents: Agent[];
  pellets: Pellet[];
  bursts: Burst[];
  nextPellet: number;
  eaten: number;
};

const idx = (x: number, y: number) => y * N + x;
const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < N && y < N;

function createSim(seed: number): Sim {
  const rnd = mulberry32(seed);
  const owner = new Int8Array(N * N).fill(-1);
  const agents: Agent[] = [];
  const corners = [
    [1, 1],
    [N - 2, 1],
    [Math.floor(N / 2), N - 2],
  ];
  TEAMS.forEach((_, team) => {
    for (let k = 0; k < AGENTS_PER_TEAM; k++) {
      const c = corners[team]!;
      const x = Math.max(0, Math.min(N - 1, c[0]! + Math.floor(rnd() * 3) - 1));
      const y = Math.max(0, Math.min(N - 1, c[1]! + Math.floor(rnd() * 3) - 1));
      owner[idx(x, y)] = team;
      agents.push({ team, fx: x, fy: y, tx: x, ty: y, t: 1, dur: STEP, px: -1, py: -1, glow: 0, bob: rnd() * 6.28, aim: -1, trail: [] });
    }
  });
  return {
    rnd,
    time: 0,
    roundT: 0,
    owner,
    pulse: new Float32Array(N * N).fill(-10),
    clearAt: new Float32Array(N * N),
    agents,
    pellets: [],
    bursts: [],
    nextPellet: 0.2,
    eaten: 0,
  };
}

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** Each agent decides one tile step at a time: chase a near pellet, else push into unclaimed or rival ground. */
function decide(s: Sim, a: Agent) {
  const x = a.tx;
  const y = a.ty;
  // nearest pellet within reach, shared targets are fine (agents race for them)
  let best = -1;
  let bd = 6.5;
  s.pellets.forEach((p, i) => {
    if (!p.alive) return;
    const d = Math.abs(p.x - x) + Math.abs(p.y - y);
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  a.aim = best;
  let choice: readonly [number, number] | null = null;
  let score = -Infinity;
  for (const d of DIRS) {
    const nx = x + d[0];
    const ny = y + d[1];
    if (!inside(nx, ny)) continue;
    const o = s.owner[idx(nx, ny)]!;
    let sc = o === -1 ? 2.2 : o === a.team ? 0 : 2.9;
    if (nx === a.px && ny === a.py) sc -= 2.5;
    if (best >= 0) {
      const p = s.pellets[best]!;
      const before = Math.abs(p.x - x) + Math.abs(p.y - y);
      const after = Math.abs(p.x - nx) + Math.abs(p.y - ny);
      if (after < before) sc += 3.2;
    }
    // drift away from the board rim a little so the action stays centred
    const c = (N - 1) / 2;
    sc -= (Math.abs(nx - c) + Math.abs(ny - c)) * 0.06;
    sc += s.rnd() * 1.6;
    if (sc > score) {
      score = sc;
      choice = d;
    }
  }
  if (!choice) return;
  a.px = x;
  a.py = y;
  a.fx = x;
  a.fy = y;
  a.tx = x + choice[0];
  a.ty = y + choice[1];
  a.t = 0;
  a.dur = STEP * (0.85 + s.rnd() * 0.35);
}

function step(s: Sim, dt: number) {
  s.time += dt;
  s.roundT += dt;
  const now = s.time;

  // round over: the board wipes in a wave from the centre and a new 15:00 starts
  if (s.roundT >= ROUND_REAL) {
    s.roundT = 0;
    const c = (N - 1) / 2;
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const i = idx(x, y);
        if (s.owner[i]! >= 0) {
          s.clearAt[i] = now + 0.15 + Math.hypot(x - c, y - c) * 0.07;
          s.pulse[i] = now;
        }
      }
  }
  for (let i = 0; i < N * N; i++) {
    const c = s.clearAt[i]!;
    if (c && now >= c) {
      s.owner[i] = -1;
      s.clearAt[i] = 0;
      s.pulse[i] = now;
    }
  }

  // pellets keep spawning on free ground
  if (now >= s.nextPellet) {
    s.nextPellet = now + 0.45 + s.rnd() * 0.6;
    const live = s.pellets.filter((p) => p.alive);
    if (live.length < MAX_PELLETS) {
      const x = Math.floor(s.rnd() * N);
      const y = Math.floor(s.rnd() * N);
      if (!live.some((p) => p.x === x && p.y === y)) {
        const slot = s.pellets.findIndex((p) => !p.alive);
        const p = { x, y, born: now, alive: true };
        if (slot >= 0) s.pellets[slot] = p;
        else s.pellets.push(p);
      }
    }
  }

  for (const a of s.agents) {
    a.glow = Math.max(0, a.glow - dt * 1.6);
    if (a.t >= 1) decide(s, a);
    a.t = Math.min(1, a.t + dt / a.dur);
    if (a.t >= 1) {
      // arrived: claim the tile, eat any pellet on it
      const i = idx(a.tx, a.ty);
      if (s.owner[i] !== a.team && !s.clearAt[i]) {
        s.owner[i] = a.team;
        s.pulse[i] = now;
      }
      for (const p of s.pellets) {
        if (p.alive && p.x === a.tx && p.y === a.ty) {
          p.alive = false;
          a.glow = 1;
          s.eaten++;
          s.bursts.push({ x: a.tx + 0.5, y: a.ty + 0.5, t0: now, rgb: TEAMS[a.team]!.rgb });
        }
      }
    }
  }
  s.bursts = s.bursts.filter((b) => now - b.t0 < 0.9);
}

const ease = (t: number) => t * t * (3 - 2 * t);
function agentPos(a: Agent) {
  const e = ease(a.t);
  return { x: a.fx + (a.tx - a.fx) * e + 0.5, y: a.fy + (a.ty - a.fy) * e + 0.5, hop: Math.sin(a.t * Math.PI) };
}

/* ───────── rendering ───────── */

function glowSprite(rgb: string, core: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, core);
  r.addColorStop(0.12, `rgba(${rgb},0.95)`);
  r.addColorStop(0.35, `rgba(${rgb},0.35)`);
  r.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return c;
}

type View = { w: number; h: number; cx: number; cy: number; hw: number; hh: number };

function layout(w: number, h: number): View {
  const narrow = w < 520;
  const hw = Math.min((w * (narrow ? 0.4 : 0.4)) / N, (h * (narrow ? 0.56 : 0.62)) / N);
  return { w, h, cx: w * (narrow ? 0.46 : 0.5), cy: h * (narrow ? 0.45 : 0.53), hw, hh: hw * 0.52 };
}
const iso = (v: View, gx: number, gy: number) => [v.cx + (gx - gy) * v.hw, v.cy + (gx + gy - N) * v.hh] as const;

function draw(ctx: CanvasRenderingContext2D, v: View, s: Sim, sprites: HTMLCanvasElement[], pellet: HTMLCanvasElement) {
  const now = s.time;
  ctx.clearRect(0, 0, v.w, v.h);
  const half = N / 2;

  // board: inset diamonds of light, no outlines; fade toward the rim
  for (let sum = 0; sum <= 2 * (N - 1); sum++) {
    for (let x = Math.max(0, sum - N + 1); x <= Math.min(N - 1, sum); x++) {
      const y = sum - x;
      const i = idx(x, y);
      const o = s.owner[i]!;
      const d = Math.hypot(x + 0.5 - half, y + 0.5 - half) / half;
      const fade = Math.max(0.1, Math.min(1, 1.18 - d * 0.78));
      const age = now - s.pulse[i]!;
      const p = age >= 0 && age < 0.7 ? 1 - age / 0.7 : 0;
      const lift = p * p * 7 * (v.hw / 24);
      const k = 0.43; // inset: half size of the drawn diamond in tile units
      const [x0, y0] = iso(v, x + 0.5, y + 0.5);
      const yy = y0 - lift;
      ctx.beginPath();
      ctx.moveTo(x0, yy - v.hh * 2 * k);
      ctx.lineTo(x0 + v.hw * 2 * k, yy);
      ctx.lineTo(x0, yy + v.hh * 2 * k);
      ctx.lineTo(x0 - v.hw * 2 * k, yy);
      ctx.closePath();
      if (o >= 0) {
        const t = TEAMS[o]!;
        ctx.fillStyle = `rgba(${t.rgb},${((0.46 + p * 0.5) * fade).toFixed(3)})`;
        ctx.fill();
        if (lift > 0.3) {
          // depth: the side face of a tile popping up
          ctx.fillStyle = `rgba(${t.rgb},${(0.25 * p * fade).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(x0 - v.hw * 2 * k, yy);
          ctx.lineTo(x0, yy + v.hh * 2 * k);
          ctx.lineTo(x0 + v.hw * 2 * k, yy);
          ctx.lineTo(x0 + v.hw * 2 * k, y0);
          ctx.lineTo(x0, y0 + v.hh * 2 * k);
          ctx.lineTo(x0 - v.hw * 2 * k, y0);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // neutral ground drifts from violet (left) to teal (right)
        const m = (x - y + N) / (2 * N);
        const r = Math.round(155 + (0 - 155) * m);
        const g = Math.round(123 + (198 - 123) * m);
        const b = Math.round(255 + (201 - 255) * m);
        ctx.fillStyle = `rgba(${r},${g},${b},${((0.05 + p * 0.25) * fade).toFixed(3)})`;
        ctx.fill();
      }
    }
  }

  ctx.globalCompositeOperation = "lighter";

  // claim rings: expanding diamond of light on each flip
  for (let i = 0; i < N * N; i++) {
    const age = now - s.pulse[i]!;
    if (age < 0 || age > 0.8) continue;
    const o = s.owner[i]!;
    const rgb = o >= 0 ? TEAMS[o]!.rgb : "155,123,255";
    const x = i % N;
    const y = (i - x) / N;
    const [x0, y0] = iso(v, x + 0.5, y + 0.5);
    const k = 0.5 + age * 0.9;
    ctx.strokeStyle = `rgba(${rgb},${(0.7 * (1 - age / 0.8)).toFixed(3)})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0 - v.hh * 2 * k);
    ctx.lineTo(x0 + v.hw * 2 * k, y0);
    ctx.lineTo(x0, y0 + v.hh * 2 * k);
    ctx.lineTo(x0 - v.hw * 2 * k, y0);
    ctx.closePath();
    ctx.stroke();
  }

  // pellets: small floating gems of white light
  const ps = v.hw * 1.5;
  for (const p of s.pellets) {
    if (!p.alive) continue;
    const grow = Math.min(1, (now - p.born) / 0.4);
    const [x0, y0] = iso(v, p.x + 0.5, p.y + 0.5);
    const yb = y0 - v.hh * 0.9 - Math.sin(now * 3 + p.x * 1.7 + p.y) * v.hh * 0.25;
    const sz = ps * grow;
    ctx.drawImage(pellet, x0 - sz / 2, yb - sz / 2, sz, sz);
    ctx.fillStyle = "rgba(242,251,251,0.95)";
    const g = v.hw * 0.14 * grow;
    ctx.beginPath();
    ctx.moveTo(x0, yb - g * 1.4);
    ctx.lineTo(x0 + g, yb);
    ctx.lineTo(x0, yb + g * 1.4);
    ctx.lineTo(x0 - g, yb);
    ctx.closePath();
    ctx.fill();
  }

  // agents: intent beam to the pellet each one is hunting, a short light trail, then the orb
  const order = s.agents.map((a) => ({ a, ...agentPos(a) })).sort((m, n) => m.x + m.y - (n.x + n.y));
  for (const { a, x, y } of order) {
    const t = TEAMS[a.team]!;
    const p = a.aim >= 0 ? s.pellets[a.aim] : undefined;
    if (p && p.alive) {
      const [ax, ay] = iso(v, x, y);
      const [bx, by] = iso(v, p.x + 0.5, p.y + 0.5);
      ctx.setLineDash([2, 5]);
      ctx.lineDashOffset = -now * 18;
      ctx.strokeStyle = `rgba(${t.rgb},0.38)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax, ay - v.hh * 0.6);
      ctx.lineTo(bx, by - v.hh * 0.9);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    a.trail.push({ x, y });
    if (a.trail.length > 14) a.trail.shift();
    for (let k = 0; k < a.trail.length; k++) {
      const q = a.trail[k]!;
      const [qx, qy] = iso(v, q.x, q.y);
      const f = (k + 1) / a.trail.length;
      const sz = v.hw * 0.9 * f;
      ctx.globalAlpha = 0.18 * f;
      ctx.drawImage(sprites[a.team]!, qx - sz / 2, qy - v.hh * 0.5 - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
  }
  for (const { a, x, y, hop } of order) {
    const [sx, sy] = iso(v, x, y);
    const hover = v.hh * (0.75 + hop * 0.7 + Math.sin(now * 4 + a.bob) * 0.12);
    // ground light under the agent
    ctx.globalAlpha = 0.55;
    const gs = v.hw * 2.4;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(1, 0.52);
    ctx.drawImage(sprites[a.team]!, -gs / 2, -gs / 2, gs, gs);
    ctx.restore();
    ctx.globalAlpha = 1;
    const sz = v.hw * (2.5 + a.glow * 1.8);
    ctx.drawImage(sprites[a.team]!, sx - sz / 2, sy - hover - sz / 2, sz, sz);
    // crisp core
    ctx.fillStyle = TEAMS[a.team]!.core;
    ctx.beginPath();
    ctx.arc(sx, sy - hover, Math.max(1.8, v.hw * 0.15), 0, Math.PI * 2);
    ctx.fill();
  }

  // pellet bursts
  for (const b of s.bursts) {
    const age = (now - b.t0) / 0.9;
    const [bx, by] = iso(v, b.x, b.y);
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * Math.PI * 2 + b.t0;
      const r = v.hw * (0.3 + age * 1.5);
      ctx.fillStyle = `rgba(${b.rgb},${(1 - age).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(ang) * r, by - v.hh + Math.sin(ang) * r * 0.55, Math.max(0.8, v.hw * 0.07 * (1 - age)), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
}

/* ───────── overlay helpers ───────── */

function Layer({ depth, tilt, delay, className, children }: { depth: number; tilt: number; delay: number; className?: string; children: React.ReactNode }) {
  return (
    <div data-depth={depth} className="pointer-events-none absolute inset-0 will-change-transform">
      <div data-tilt={tilt} className="absolute inset-0">
        <div className={cn("eco-fade absolute inset-0", className)} style={{ "--eco-d": `calc(var(--eco-base, 0) + ${delay})` } as React.CSSProperties}>
          {children}
        </div>
      </div>
    </div>
  );
}

const CSS = `
@keyframes aa-flow { to { stroke-dashoffset: -16; } }
@keyframes aa-orbit { 0%,100% { transform: translate3d(0,0,0) rotate(-2deg); } 50% { transform: translate3d(0,-6px,0) rotate(2deg); } }
.aa-flow { animation: aa-flow 1.1s linear infinite; }
.aa-orbit { animation: aa-orbit 9s ease-in-out infinite; transform-origin: 50% 30%; }
.aa-mask { -webkit-mask-image: radial-gradient(60% 62% at 50% 52%, #000 55%, transparent 100%); mask-image: radial-gradient(60% 62% at 50% 52%, #000 55%, transparent 100%); }
`;

const MONO = "font-mono uppercase tracking-[0.16em]";

/** Executive agent at the top, linked to its three role agents by flowing lines of light. */
function Constellation() {
  const nodes: [number, number, string][] = [
    [80, 18, "#9B7BFF"],
    [22, 82, "#00C6C9"],
    [80, 100, "#3DF5B0"],
    [138, 82, "#00C6C9"],
  ];
  return (
    <div className="eco-anim aa-orbit relative w-[150px] sm:w-[170px]">
      <svg viewBox="0 0 160 126" className="w-full overflow-visible">
        <defs>
          <radialGradient id="aa-node">
            <stop offset="0" stopColor="#F2FBFB" />
            <stop offset="0.35" stopColor="#9B7BFF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#9B7BFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {nodes.slice(1).map(([x, y, c], i) => (
          <g key={i}>
            <line x1={80} y1={18} x2={x} y2={y} stroke={c} strokeOpacity={0.22} strokeWidth={1} />
            <line
              x1={80}
              y1={18}
              x2={x}
              y2={y}
              stroke={c}
              strokeWidth={1.4}
              strokeDasharray="2 6"
              strokeLinecap="round"
              className="eco-anim aa-flow"
              style={{ animationDelay: `${-i * 0.35}s` }}
            />
          </g>
        ))}
        <path d="M22 82 Q80 120 138 82" fill="none" stroke="#9B7BFF" strokeOpacity={0.16} strokeWidth={1} />
        {nodes.map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === 0 ? 13 : 9} fill={c} opacity={0.18} />
            <circle cx={x} cy={y} r={i === 0 ? 4 : 3} fill={c} />
            <circle cx={x} cy={y} r={i === 0 ? 1.8 : 1.3} fill="#F2FBFB" />
          </g>
        ))}
      </svg>
      {/* labels sit in HTML so they stay crisp; positions mirror the viewBox */}
      {ROLES.map((r, i) => {
        const [x, y] = nodes[i]!;
        return (
          <span
            key={r}
            className={cn(MONO, "absolute -translate-x-1/2 whitespace-nowrap text-[8.5px] leading-none sm:text-[9.5px]")}
            style={{
              left: `${(x / 160) * 100}%`,
              top: `${((y + (i === 0 ? -20 : 14)) / 126) * 100}%`,
              color: i === 0 ? "#CFC1FF" : i === 2 ? "#9DF9D4" : "#8DE6E7",
              textShadow: "0 0 12px rgba(155,123,255,0.6)",
            }}
          >
            {r}
          </span>
        );
      })}
    </div>
  );
}

function fmt(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export function AgentArena({ images }: { images: readonly string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counts = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const eaten = useRef<HTMLSpanElement>(null);
  const [territory, food] = images;

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = TEAMS.map((t) => glowSprite(t.rgb, t.core));
    const pellet = glowSprite("190,240,255", "#FFFFFF");
    const sim = createSim(7);
    // start mid round with a board already in play, so the first frame is composed
    for (let k = 0; k < 14 * 30; k++) step(sim, 1 / 30);
    sim.roundT = ROUND_REAL * 0.38;

    let view = layout(1, 1);
    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view = layout(r.width, r.height);
    };

    let lastHud = -1;
    const hud = () => {
      const tally = [0, 0, 0];
      for (let i = 0; i < N * N; i++) {
        const o = sim.owner[i]!;
        if (o >= 0) tally[o]!++;
      }
      const max = Math.max(1, ...tally);
      tally.forEach((n, i) => {
        const c = counts.current[i];
        if (c) c.textContent = String(n).padStart(2, "0");
        const b = bars.current[i];
        if (b) b.style.transform = `scaleX(${(0.06 + 0.94 * (n / max)).toFixed(3)})`;
      });
      const left = ROUND_SECONDS * (1 - sim.roundT / ROUND_REAL);
      if (timer.current) timer.current.textContent = fmt(left);
      if (ring.current) ring.current.style.strokeDashoffset = String((RING_C * (1 - left / ROUND_SECONDS)).toFixed(2));
      if (eaten.current) eaten.current.textContent = String(sim.eaten).padStart(3, "0");
    };

    resize();
    draw(ctx, view, sim, sprites, pellet);
    hud();
    const ro = new ResizeObserver(() => {
      resize();
      draw(ctx, view, sim, sprites, pellet);
    });
    ro.observe(host);
    if (reduce) return () => ro.disconnect();

    let raf = 0;
    let last = 0;
    let onScreen = false;
    const frame = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      step(sim, dt);
      draw(ctx, view, sim, sprites, pellet);
      if (t - lastHud > 90) {
        lastHud = t;
        hud();
      }
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const run = onScreen && document.visibilityState === "visible";
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = !!e?.isIntersecting;
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <style>{CSS}</style>

      {/* back: violet light pool + the real arena renders as faint, masked depth */}
      <Layer depth={-22} tilt={-6} delay={280}>
        <div
          className="eco-anim eco-glow absolute left-1/2 top-[50%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(155,123,255,0.30), rgba(0,198,201,0.10) 55%, transparent)" }}
        />
        {territory && (
          <div className="absolute left-[2%] top-[6%] h-[70%] w-[42%] hidden opacity-[0.12] mix-blend-screen sm:block" style={{ maskImage: "radial-gradient(closest-side, #000 20%, transparent)", WebkitMaskImage: "radial-gradient(closest-side, #000 20%, transparent)" }}>
            <Image src={territory} alt="" fill sizes="300px" className="object-cover" />
          </div>
        )}
        {food && (
          <div className="absolute right-[2%] top-[22%] h-[70%] w-[42%] hidden opacity-[0.12] mix-blend-screen sm:block" style={{ maskImage: "radial-gradient(closest-side, #000 20%, transparent)", WebkitMaskImage: "radial-gradient(closest-side, #000 20%, transparent)" }}>
            <Image src={food} alt="" fill sizes="300px" className="object-cover" />
          </div>
        )}
      </Layer>

      {/* mid: the live simulation */}
      <Layer depth={8} tilt={10} delay={420}>
        <div ref={wrap} className="aa-mask absolute inset-0">
          <canvas
            ref={canvas}
            role="img"
            aria-label="Animated agent arena: AI agent teams claim tiles in Territory Control and collect pellets in Food Collector"
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </Layer>

      {/* fore: floating HUD, borderless, light only */}
      <Layer depth={30} tilt={22} delay={600}>
        {/* agent team constellation */}
        <div className="absolute left-[1%] top-[3%] hidden scale-90 sm:block lg:scale-100" style={{ transformOrigin: "0 0" }}>
          <Constellation />
        </div>

        {/* contest timer ring */}
        <div className="absolute right-[2%] top-[3%] flex items-center gap-3">
          <div className="text-right">
            <div className={cn(MONO, "text-[10px] text-[#CFC1FF] sm:text-[11px]")}>$IDLE</div>
            <span ref={timer} className="mt-1 block font-mono text-[18px] font-medium tabular-nums leading-none text-[#F2FBFB] sm:text-[22px]" style={{ textShadow: "0 0 18px rgba(155,123,255,0.8)" }}>
              09:18
            </span>
          </div>
          <svg viewBox="0 0 64 64" className="size-12 -rotate-90 sm:size-16" aria-hidden>
            <defs>
              <linearGradient id="aa-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#9B7BFF" />
                <stop offset="1" stopColor="#00C6C9" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r={RING_R + 5} fill="rgba(155,123,255,0.12)" style={{ filter: "blur(4px)" }} />
            <circle cx="32" cy="32" r={RING_R} fill="none" stroke="rgba(155,123,255,0.18)" strokeWidth="2" />
            <circle
              ref={ring}
              cx="32"
              cy="32"
              r={RING_R}
              fill="none"
              stroke="url(#aa-ring)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * 0.38}
              style={{ filter: "drop-shadow(0 0 5px rgba(155,123,255,0.9))" }}
            />
          </svg>
        </div>

        {/* Territory Control scoreboard */}
        <div className="absolute bottom-[3%] right-[2%] w-[132px] sm:w-[150px]">
          <div className={cn(MONO, "mb-2.5 whitespace-nowrap text-[9.5px] text-[#CFC1FF] sm:text-[11px]")}>Territory Control</div>
          <ul className="flex flex-col gap-2">
            {TEAMS.map((t, i) => (
              <li key={t.name} className="flex items-center gap-2.5">
                <span className="size-2 shrink-0 rounded-full" style={{ background: t.hex, boxShadow: `0 0 10px ${t.hex}` }} />
                <span
                  ref={(n) => {
                    counts.current[i] = n;
                  }}
                  className="w-6 font-mono text-[13px] tabular-nums leading-none text-[#F2FBFB] sm:text-[15px]"
                >
                  00
                </span>
                <span className="relative h-[3px] flex-1">
                  <span
                    ref={(n) => {
                      bars.current[i] = n;
                    }}
                    className="absolute inset-0 origin-left rounded-full transition-transform duration-300"
                    style={{ background: `linear-gradient(90deg, ${t.hex}, rgba(${t.rgb},0))`, transform: "scaleX(0.3)" }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Food Collector tally */}
        <div className="absolute bottom-[3%] left-[2%]">
          <div className={cn(MONO, "text-[9.5px] text-[#8DE6E7] sm:text-[11px]")}>Food Collector</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="size-2 rotate-45 rounded-[1px] bg-[#F2FBFB]" style={{ boxShadow: "0 0 10px rgba(190,240,255,1)" }} />
            <span ref={eaten} className="font-mono text-[13px] tabular-nums leading-none text-[#F2FBFB] sm:text-[15px]">
              000
            </span>
          </div>
        </div>
      </Layer>
    </div>
  );
}
