"use client";

import { useEffect, useRef } from "react";

/**
 * $IDLE hero particle field — raw WebGL1 (no three.js: ~4 KB, one draw call).
 *
 * Points are sampled from the white leaf-flame in /assets/img/idlemine-mark.png, plus the coin rim,
 * an outer orbit, a halo and a sparse full-bleed dust field. All motion runs in the vertex shader
 * from a single `u_time` uniform, so the CPU only uploads ~8 uniforms per frame.
 *
 * The mark is positioned over an "anchor" element (the layout slot in the hero grid), so the
 * static fallback and the particle mark share an identical footprint.
 */

const MARK_SRC = "/assets/img/idlemine-mark.png";

const VERT = /* glsl */ `
precision highp float;
attribute vec2 a_pos;
attribute vec4 a_seed;
attribute float a_kind;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_center;
uniform float u_size;
uniform float u_dpr;
uniform vec2 u_par;
uniform vec3 u_mouse;   // cursor (css px, canvas space) + strength
uniform float u_scroll; // 0..1 hero scroll progress
varying vec4 v_col;

const vec3 T300 = vec3(0.302, 0.851, 0.859);
const vec3 T400 = vec3(0.000, 0.776, 0.788);
const vec3 T600 = vec3(0.004, 0.584, 0.592);
const vec3 MINT = vec3(0.239, 0.961, 0.690);
const vec3 ICE  = vec3(0.880, 1.000, 0.985);
const vec3 VIO  = vec3(0.608, 0.482, 1.000);

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float easeOut(float x) { return 1.0 - pow(1.0 - x, 4.0); }

void main() {
  float t = u_time;
  float k = a_kind;
  vec2 p;
  vec3 col;
  float alpha;
  float size;
  float unit = clamp(u_size / 520.0, 0.8, 1.2);

  if (k < 3.5) {
    vec2 m = a_pos;
    if (k > 0.5 && k < 1.5) m = rot(t * 0.035) * m;           // coin rim: slow turn
    if (k > 1.5 && k < 2.5) m = rot(-t * 0.018) * m;          // outer orbit: counter-turn
    if (k > 2.5) m = rot(t * (0.008 + 0.022 * a_seed.z)) * m; // halo: lazy orbit

    m *= 1.0 + 0.010 * sin(t * 0.42);                         // breathing

    vec2 drift = vec2(
      sin(t * (0.22 + 0.30 * a_seed.x) + a_seed.y * 6.2832),
      cos(t * (0.18 + 0.26 * a_seed.y) + a_seed.x * 6.2832));
    m += drift * (k < 0.5 ? 0.0035 : (k < 2.5 ? 0.0025 : 0.016));

    // Intro: particles gather from a loose cloud into the mark.
    float delay = a_seed.x * 1.1 + (k > 0.5 ? 0.35 : 0.0);
    float g = easeOut(clamp((t - delay) / 2.8, 0.0, 1.0));
    vec2 dir = normalize(m + (a_seed.zw - 0.5) * 0.9 + 0.0001);
    vec2 start = m * 0.35 + dir * (0.45 + 0.85 * a_seed.w) + (a_seed.yz - 0.5) * 0.35;
    m = mix(start, m, g);

    // Scroll: the mark lags the page slightly, shrinks and fades as the hero leaves.
    float sz = u_size * (1.0 - 0.2 * u_scroll);
    p = u_center + vec2(0.0, u_scroll * 90.0) + u_par * (k < 0.5 ? 1.0 : 0.6) + vec2(m.x, -m.y) * sz;

    // Slow diagonal light sweep across the mark.
    float sweep = 0.5 + 0.5 * sin(t * 0.5 - (a_pos.x - a_pos.y) * 6.5);
    float intro = clamp((t - delay) / 1.2, 0.0, 1.0);

    // Colour depth across the mark: mint light from the upper right, violet on the far lower left.
    float lit = a_pos.x + a_pos.y;

    if (k < 0.5) {
      col = mix(T400, T300, a_seed.z);
      col = mix(col, MINT, smoothstep(0.05, 0.55, lit) * 0.75);
      col = mix(col, VIO, smoothstep(-0.15, -0.6, lit) * 0.55);
      if (a_seed.w > 0.93) col = MINT;
      col = mix(col, ICE, sweep * sweep * 0.42);
      alpha = (0.58 + 0.42 * sweep) * intro;
      size = (1.5 + 1.5 * a_seed.y) * unit;
    } else if (k < 1.5) {
      float ang = atan(m.y, m.x);
      float glint = pow(0.5 + 0.5 * cos(ang - t * 0.32 - 0.8), 6.0);
      float far = smoothstep(-0.1, -0.7, (a_pos.x + a_pos.y) * 1.414);
      col = mix(mix(T600, VIO, far * 0.9), T300, glint);
      col = mix(col, ICE, glint * 0.35);
      alpha = (0.40 + 0.60 * glint) * intro;
      size = (1.2 + 1.0 * a_seed.y + 1.2 * glint) * unit;
    } else if (k < 2.5) {
      col = mix(T400, VIO, smoothstep(-0.2, -0.8, (a_pos.x + a_pos.y) * 1.2));
      alpha = (0.16 + 0.18 * a_seed.z) * intro;
      size = (1.0 + 0.8 * a_seed.y) * unit;
    } else {
      col = mix(T400, T300, a_seed.y);
      if (a_seed.w > 0.86) col = MINT;
      else if (a_seed.w < 0.2) col = VIO;
      float tw = 0.5 + 0.5 * sin(t * (0.6 + a_seed.z) + a_seed.x * 40.0);
      alpha = (0.06 + 0.22 * tw) * intro;
      size = (1.0 + 1.6 * a_seed.z) * unit;
    }
  } else {
    // Full-bleed dust: rises very slowly, wraps, fades near the hero's top/bottom edges.
    float h = u_res.y + 40.0;
    float y = mod(a_seed.y * h - t * (4.0 + 9.0 * a_seed.z), h) - 20.0;
    float x = a_seed.x * u_res.x + sin(t * 0.15 + a_seed.w * 6.2832) * 14.0;
    // Depth layers: near (big) stars parallax more with pointer and scroll than far ones.
    float depth = a_seed.z;
    p = vec2(x, y) + u_par * (0.2 + 1.6 * depth) + vec2(0.0, u_scroll * (20.0 + 140.0 * depth));
    float edge = smoothstep(0.0, 120.0, y) * smoothstep(u_res.y, u_res.y - 160.0, y);
    float tw = 0.5 + 0.5 * sin(t * (0.4 + 0.8 * a_seed.z) + a_seed.w * 30.0);
    col = a_seed.w > 0.9 ? MINT : (a_seed.w < 0.16 ? VIO : mix(T400, T300, a_seed.z));
    alpha = (0.06 + 0.26 * tw) * edge * clamp(t / 2.0, 0.0, 1.0);
    size = 1.0 + 1.4 * a_seed.z;
  }

  // Scroll fade (mark fades faster than the ambient dust).
  alpha *= 1.0 - (k < 3.5 ? 0.9 : 0.5) * u_scroll;

  // Cursor: a soft radial push; the CPU springs the cursor position so particles ease back.
  vec2 dm = p - u_mouse.xy;
  float r2 = dot(dm, dm);
  float R = 115.0 * unit;
  float f = exp(-r2 / (R * R)) * u_mouse.z;
  p += dm / (sqrt(r2) + 0.5) * f * 58.0 * unit;
  col = mix(col, ICE, f * 0.55);
  alpha *= 1.0 + f * 0.6;

  vec2 clip = (p / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * u_dpr * 2.2, 1.0);
  v_col = vec4(col, alpha);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
varying vec4 v_col;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = smoothstep(0.55, 0.0, d);
  float glow = smoothstep(1.0, 0.0, d) * 0.28;
  float a = (core + glow) * v_col.a;
  gl_FragColor = vec4(v_col.rgb * a, a);
}
`;

type Counts = { leaf: number; ring: number; orbit: number; halo: number; dust: number };

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Samples the white leaf-flame pixels (and its edges) from the mark. Coordinates in [-0.5, 0.5], y up. */
async function sampleMark(): Promise<{ fill: Float32Array; edge: Float32Array }> {
  const img = new Image();
  img.decoding = "async";
  img.src = MARK_SRC;
  await img.decode();
  const S = 256;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, S, S);
  const d = ctx.getImageData(0, 0, S, S).data;
  const white = new Uint8Array(S * S);
  for (let i = 0; i < S * S; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3];
    white[i] = a > 200 && r > 190 && g > 190 && b > 190 ? 1 : 0;
  }
  const fill: number[] = [];
  const edge: number[] = [];
  for (let y = 1; y < S - 1; y++) {
    for (let x = 1; x < S - 1; x++) {
      const i = y * S + x;
      if (!white[i]) continue;
      const px = x / S - 0.5;
      const py = 0.5 - y / S;
      fill.push(px, py);
      if (!white[i - 1] || !white[i + 1] || !white[i - S] || !white[i + S]) edge.push(px, py);
    }
  }
  return { fill: new Float32Array(fill), edge: new Float32Array(edge) };
}

function buildBuffers(sample: { fill: Float32Array; edge: Float32Array }, n: Counts) {
  const total = n.leaf + n.ring + n.orbit + n.halo + n.dust;
  const pos = new Float32Array(total * 2);
  const seed = new Float32Array(total * 4);
  const kind = new Float32Array(total);
  const r = rng(7);
  const jitter = 0.9 / 256;
  let o = 0;
  const push = (x: number, y: number, k: number) => {
    pos[o * 2] = x;
    pos[o * 2 + 1] = y;
    seed[o * 4] = r();
    seed[o * 4 + 1] = r();
    seed[o * 4 + 2] = r();
    seed[o * 4 + 3] = r();
    kind[o] = k;
    o++;
  };
  const fillN = sample.fill.length / 2;
  const edgeN = sample.edge.length / 2;
  for (let i = 0; i < n.leaf; i++) {
    const useEdge = edgeN > 0 && r() < 0.42;
    const src = useEdge ? sample.edge : sample.fill;
    const j = Math.floor(r() * (useEdge ? edgeN : fillN));
    push(src[j * 2] + (r() - 0.5) * jitter, src[j * 2 + 1] + (r() - 0.5) * jitter, 0);
  }
  for (let i = 0; i < n.ring; i++) {
    const a = (i / n.ring) * Math.PI * 2 + r() * 0.004;
    const rad = 0.492 + (r() - 0.5) * 0.008;
    push(Math.cos(a) * rad, Math.sin(a) * rad, 1);
  }
  for (let i = 0; i < n.orbit; i++) {
    const a = (i / n.orbit) * Math.PI * 2;
    // dashed: skip a few arcs for a precise, instrument-like orbit
    if (Math.sin(a * 6) < -0.55) continue;
    push(Math.cos(a) * 0.6, Math.sin(a) * 0.6, 2);
  }
  for (let i = 0; i < n.halo; i++) {
    const a = r() * Math.PI * 2;
    const rad = 0.53 + Math.pow(r(), 1.6) * 0.42;
    push(Math.cos(a) * rad, Math.sin(a) * rad, 3);
  }
  for (let i = 0; i < n.dust; i++) push(0, 0, 4);
  return { pos, seed, kind, count: o };
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

export default function MarkField({
  anchor,
  still = false,
  onReady,
  onFail,
  className,
}: {
  /** Element whose box the mark fills (selector, resolved inside the canvas's parent section). */
  anchor: string;
  /** Reduced motion: draw one settled frame and stop. */
  still?: boolean;
  onReady?: () => void;
  onFail?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.closest("section") ?? canvas.parentElement!;
    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) {
      onFail?.();
      return;
    }

    (async () => {
      let sample: Awaited<ReturnType<typeof sampleMark>>;
      try {
        sample = await sampleMark();
      } catch {
        if (!disposed) onFail?.();
        return;
      }
      if (disposed) return;

      let prog: WebGLProgram;
      try {
        prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
      } catch {
        onFail?.();
        return;
      }
      gl.useProgram(prog);

      const small = window.innerWidth < 768;
      const counts: Counts = small
        ? { leaf: 1600, ring: 320, orbit: 180, halo: 160, dust: 120 }
        : { leaf: 5600, ring: 760, orbit: 420, halo: 420, dust: 380 };
      const { pos, seed, kind, count } = buildBuffers(sample, counts);

      const attr = (name: string, data: Float32Array, size: number) => {
        const loc = gl.getAttribLocation(prog, name);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        return buf;
      };
      const bufs = [attr("a_pos", pos, 2), attr("a_seed", seed, 4), attr("a_kind", kind, 1)];

      const u = (n: string) => gl.getUniformLocation(prog, n);
      const uTime = u("u_time"), uRes = u("u_res"), uCenter = u("u_center"), uSize = u("u_size");
      const uDpr = u("u_dpr"), uPar = u("u_par"), uMouse = u("u_mouse"), uScroll = u("u_scroll");

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.clearColor(0, 0, 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let W = 0, H = 0, cx = 0, cy = 0, size = 0;
      const layout = () => {
        const rect = canvas.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = Math.max(1, Math.round(W * dpr));
        canvas.height = Math.max(1, Math.round(H * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        const a = host.querySelector<HTMLElement>(anchor);
        if (a) {
          const ar = a.getBoundingClientRect();
          cx = ar.left - rect.left + ar.width / 2;
          cy = ar.top - rect.top + ar.height / 2;
          size = Math.min(ar.width, ar.height);
        } else {
          cx = W * 0.7;
          cy = H * 0.5;
          size = Math.min(W, H) * 0.6;
        }
      };
      layout();

      // Pointer parallax (mouse / pen), damped, max ±10px.
      const par = { x: 0, y: 0, tx: 0, ty: 0 };
      // Mouse / pen only (touch events are ignored in the handlers).
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        par.tx = ((e.clientX / window.innerWidth) * 2 - 1) * 10;
        par.ty = ((e.clientY / window.innerHeight) * 2 - 1) * 8;
      };
      if (!still) window.addEventListener("pointermove", onMove, { passive: true });

      // Cursor repel: an under-damped spring follows the pointer, so the field wobbles back.
      const ms = { x: -9999, y: -9999, vx: 0, vy: 0, tx: -9999, ty: -9999, s: 0, ts: 0, inside: false };
      const onHostMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const rect = canvas.getBoundingClientRect();
        ms.tx = e.clientX - rect.left;
        ms.ty = e.clientY - rect.top;
        if (!ms.inside) {
          ms.inside = true;
          ms.x = ms.tx;
          ms.y = ms.ty;
          ms.vx = ms.vy = 0;
        }
        ms.ts = 1;
      };
      const onHostLeave = () => {
        ms.inside = false;
        ms.ts = 0;
      };
      if (!still) {
        host.addEventListener("pointermove", onHostMove, { passive: true });
        host.addEventListener("pointerleave", onHostLeave);
      }
      const stepMouse = (dt: number) => {
        if (dt <= 0) return;
        const h = Math.min(dt, 1 / 30); // keep the spring stable on slow frames
        const k = 170, c = 15;
        ms.vx += ((ms.tx - ms.x) * k - ms.vx * c) * h;
        ms.vy += ((ms.ty - ms.y) * k - ms.vy * c) * h;
        ms.x += ms.vx * h;
        ms.y += ms.vy * h;
        ms.s += (ms.ts - ms.s) * (1 - Math.exp(-dt * 4));
      };
      const scrollP = () =>
        still ? 0 : Math.min(Math.max(window.scrollY / Math.max(host.offsetHeight, 1), 0), 1);

      let time = still ? 7.5 : 0;
      let last = 0;
      let running = false;
      let readySent = false;

      const draw = () => {
        par.x += (par.tx - par.x) * 0.04;
        par.y += (par.ty - par.y) * 0.04;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uTime, time);
        gl.uniform2f(uRes, W, H);
        gl.uniform2f(uCenter, cx, cy);
        gl.uniform1f(uSize, size);
        gl.uniform1f(uDpr, dpr);
        gl.uniform2f(uPar, par.x, par.y);
        const spd = Math.hypot(ms.vx, ms.vy);
        gl.uniform3f(uMouse, ms.x, ms.y, ms.s * (0.6 + 0.4 * Math.min(spd / 900, 1)));
        gl.uniform1f(uScroll, scrollP());
        gl.drawArrays(gl.POINTS, 0, count);
        if (!readySent) {
          readySent = true;
          onReady?.();
        }
      };

      const frame = (now: number) => {
        if (!running) return;
        // Wall-clock time (capped for long stalls) so slow GPUs still finish the intro on schedule.
        const dt = last ? Math.min((now - last) / 1000, 0.25) : 0;
        last = now;
        time += dt;
        stepMouse(dt);
        draw();
        raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (still || running || disposed) return;
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      let inView = true;
      const io = new IntersectionObserver(([e]) => {
        inView = e.isIntersecting;
        if (inView && !document.hidden) start();
        else stop();
      });
      io.observe(canvas);
      const onVis = () => (document.hidden || !inView ? stop() : start());
      document.addEventListener("visibilitychange", onVis);

      const ro = new ResizeObserver(() => {
        layout();
        if (!running) draw();
      });
      ro.observe(canvas);
      const anchorEl = host.querySelector<HTMLElement>(anchor);
      if (anchorEl) ro.observe(anchorEl);

      const onLost = (e: Event) => {
        e.preventDefault();
        stop();
        onFail?.();
      };
      canvas.addEventListener("webglcontextlost", onLost);

      draw();
      start();

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointermove", onHostMove);
        host.removeEventListener("pointerleave", onHostLeave);
        canvas.removeEventListener("webglcontextlost", onLost);
        bufs.forEach((b) => gl.deleteBuffer(b));
        gl.deleteProgram(prog);
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [anchor, still, onReady, onFail]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
