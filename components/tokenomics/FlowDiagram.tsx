import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { flow, hero } from "@/data/content/tokenomics";

// Ring geometry (viewBox 400×400). Stops sit at 12 o'clock, 4 o'clock and 8 o'clock, so a
// particle moving at constant speed (9s loop) reaches each one every 3s.
const C = 200;
const R = 150;
const LOOP = 9;
const PATH = `M${C},${C - R} A${R},${R} 0 1,1 ${C},${C + R} A${R},${R} 0 1,1 ${C},${C - R}`;
const ANGLES = [-90, 30, 150];
const pos = ANGLES.map((a) => {
  const rad = (a * Math.PI) / 180;
  return { x: ((C + R * Math.cos(rad)) / 400) * 100, y: ((C + R * Math.sin(rad)) / 400) * 100 };
});
// Where each stop's title sits relative to its node.
const LABEL_CLS = [
  "left-[calc(50%+34px)] top-[12.5%] -translate-y-1/2 text-left",
  "left-[82.5%] top-[calc(68.75%+34px)] -translate-x-1/2 text-center",
  "left-[17.5%] top-[calc(68.75%+34px)] -translate-x-1/2 text-center",
];

export function FlowDiagram() {
  return (
    <Section
      ariaLabelledby="tk-flow"
      blobs={[
        { color: "gold", pos: { top: "50%", left: "70%" }, size: 640, opacity: 0.16 },
        { color: "mint", pos: { top: "80%", left: "10%" }, size: 480, opacity: 0.1 },
      ]}
    >
      <div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div>
          <Reveal>
            <Eyebrow>{flow.eyebrow}</Eyebrow>
          </Reveal>
          <Heading id="tk-flow" className="mt-5" highlight={["$IDLE"]}>
            {flow.title}
          </Heading>
          <Reveal delay={0.1}>
            <p className="text-body-l mt-6 max-w-[480px]">{flow.body}</p>
          </Reveal>
          <RevealGroup as="ol" className="mt-10 space-y-3" delay={0.15}>
            {flow.stops.map((s, i) => (
              <RevealItem as="li" key={s.n}>
                <div className="flex items-center gap-4 rounded-2xl border border-line bg-white/[0.02] px-4 py-3.5">
                  <span
                    aria-hidden
                    className="tk-node flex size-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold text-gold-2"
                    style={{ animationDelay: `${i * (LOOP / 3)}s` }}
                  >
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-semibold text-ink">
                      <span className="sr-only">{s.n} · </span>
                      {s.title}
                    </p>
                    {s.label && <p className="text-sm text-ink-3">{s.label}</p>}
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal>
          <figure className="mx-auto w-full max-w-[560px]">
            <div role="img" aria-label={flow.ariaLabel} className="relative aspect-square w-full">
              <svg viewBox="0 0 400 400" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="tk-flow-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FFE08A" />
                    <stop offset="0.5" stopColor="#F5C542" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#9945FF" stopOpacity="0.8" />
                  </linearGradient>
                  <radialGradient id="tk-flow-core">
                    <stop offset="0" stopColor="#F5C542" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#F5C542" stopOpacity="0" />
                  </radialGradient>
                  <filter id="tk-flow-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                  <marker id="tk-flow-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M2,1 L8,5 L2,9" fill="none" stroke="#FFE08A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </marker>
                </defs>

                <circle cx={C} cy={C} r={120} fill="url(#tk-flow-core)" />
                <circle cx={C} cy={C} r={R + 28} fill="none" stroke="rgba(255,255,255,0.05)" />
                <circle cx={C} cy={C} r={R - 28} fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6" />
                <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <circle
                  className="tk-dash"
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke="url(#tk-flow-ring)"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  strokeLinecap="round"
                />
                {/* Direction chevrons midway between stops */}
                {[-30, 90, 210].map((a) => {
                  const rad = (a * Math.PI) / 180;
                  const x = C + R * Math.cos(rad);
                  const y = C + R * Math.sin(rad);
                  const tx = -Math.sin(rad);
                  const ty = Math.cos(rad);
                  return (
                    <path
                      key={a}
                      d={`M${x - tx * 4},${y - ty * 4} L${x + tx * 4},${y + ty * 4}`}
                      stroke="transparent"
                      markerEnd="url(#tk-flow-arrow)"
                    />
                  );
                })}

                {/* Travelling particle with a short comet trail */}
                <g className="tk-particle">
                  {[0.36, 0.24, 0.12].map((lag, i) => (
                    <circle key={lag} r={5 - i * 1.2 - 1} fill="#F5C542" opacity={0.18 + i * 0.14}>
                      <animateMotion dur={`${LOOP}s`} begin={`${-lag}s`} repeatCount="indefinite" path={PATH} />
                    </circle>
                  ))}
                  <circle r="14" fill="#F5C542" opacity="0.55" filter="url(#tk-flow-glow)">
                    <animateMotion dur={`${LOOP}s`} repeatCount="indefinite" path={PATH} />
                  </circle>
                  <circle r="5.5" fill="#FFF3C4">
                    <animateMotion dur={`${LOOP}s`} repeatCount="indefinite" path={PATH} />
                  </circle>
                </g>
              </svg>

              {/* Center token */}
              <div aria-hidden className="absolute left-1/2 top-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2">
                <div className="absolute inset-0 rounded-full shadow-[0_0_80px_10px_rgba(245,197,66,0.25)]" />
                <Image src={hero.mark.src} alt="" fill sizes="140px" className="object-contain" />
              </div>

              {/* Stops */}
              {flow.stops.map((s, i) => (
                <div key={s.n} aria-hidden>
                  <span
                    className="tk-node absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[15px] font-semibold text-gold-2 backdrop-blur md:size-14 md:text-lg"
                    style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%`, animationDelay: `${i * (LOOP / 3)}s` }}
                  >
                    {s.n}
                  </span>
                  <div className={`absolute hidden w-[170px] sm:block ${LABEL_CLS[i]}`}>
                    <p className="font-display text-[15px] font-semibold leading-tight text-ink">{s.title}</p>
                    {s.label && <p className="mt-1 text-[13px] leading-snug text-ink-3">{s.label}</p>}
                  </div>
                </div>
              ))}
            </div>
            <figcaption className="mt-6 text-center text-sm text-ink-3 sm:mt-16">{flow.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
