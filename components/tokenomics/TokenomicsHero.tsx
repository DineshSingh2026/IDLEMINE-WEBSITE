import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BackgroundBlobs } from "@/components/layout/BackgroundBlobs";
import { Grain } from "@/components/layout/Grain";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { hero } from "@/data/content/tokenomics";

const delay = (s: number) => ({ animationDelay: `${s}s` });

/** Hero — server-rendered; motion is pure CSS so the H1 is readable before hydration. */
export function TokenomicsHero() {
  const words = hero.title.split(" ");
  return (
    <section aria-labelledby="tk-hero-title" className="relative isolate overflow-hidden pb-20 pt-14 md:pb-28 md:pt-20 lg:pb-32 lg:pt-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <BackgroundBlobs
          blobs={[
            { color: "gold", pos: { top: "38%", left: "74%" }, size: 760, opacity: 0.32 },
            { color: "violet", pos: { top: "8%", left: "12%" }, size: 620, opacity: 0.28 },
            { color: "teal", pos: { top: "92%", left: "40%" }, size: 520, opacity: 0.18 },
          ]}
        />
        <div className="dot-grid absolute inset-0 opacity-70" />
        <Grain />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-deep" />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div className="relative z-10 max-w-[720px]">
          <div className="tk-in" style={delay(0)}>
            <Eyebrow className="text-gold-2/80">{hero.eyebrow}</Eyebrow>
          </div>
          <h1 id="tk-hero-title" className="text-display-xl mt-6 text-balance text-ink">
            {words.map((w, i) => (
              <span key={i}>
              {i > 0 ? " " : null}
              <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <span
                  className={
                    "tk-word " +
                    (w === "Economic" || w === "Ownership" ? "text-grad-brand" : "")
                  }
                  style={delay(0.08 + i * 0.07)}
                >
                  {w}
                </span>
              </span>
              </span>
            ))}
          </h1>
          <p className="tk-in mt-7 font-display text-xl italic text-ink-3 md:text-2xl" style={delay(0.45)}>
            {hero.kicker}
          </p>
          <p className="tk-in text-body-l mt-5 max-w-[560px]" style={delay(0.55)}>
            {hero.sub}
          </p>
          <div className="tk-in mt-10 flex flex-wrap gap-3" style={delay(0.65)}>
            <Button href={hero.ctas[0].href}>{hero.ctas[0].label}</Button>
            <Button href={hero.ctas[1].href} variant="secondary">
              {hero.ctas[1].label}
            </Button>
          </div>
        </div>

        <HeroMark />
      </Container>
    </section>
  );
}

function HeroMark() {
  return (
    <div className="tk-in relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[540px]" style={delay(0.2)}>
      {/* Halo */}
      <div aria-hidden className="tk-breathe absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(245,197,66,0.45)_0%,rgba(245,197,66,0.12)_40%,transparent_68%)] blur-2xl" />
      {/* Rings */}
      <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="tk-ring-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE08A" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#F5C542" stopOpacity="0.05" />
            <stop offset="1" stopColor="#F5C542" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="tk-ring-b" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9945FF" stopOpacity="0.6" />
            <stop offset="1" stopColor="#14F195" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,255,255,0.06)" />
        <g className="tk-spin" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="180" fill="none" stroke="url(#tk-ring-a)" strokeWidth="1.25" />
          <circle cx="200" cy="20" r="4" fill="#FFE08A" />
          <circle cx="200" cy="20" r="12" fill="#F5C542" opacity="0.25" />
        </g>
        <g className="tk-spin-rev" style={{ transformOrigin: "200px 200px" }}>
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#tk-ring-b)" strokeWidth="1" strokeDasharray="2 10" />
          <circle cx="350" cy="200" r="3" fill="#14F195" />
        </g>
        <circle cx="200" cy="200" r="122" fill="none" stroke="rgba(245,197,66,0.22)" />
      </svg>
      {/* Mark */}
      <div className="tk-float absolute inset-[22%]">
        <div aria-hidden className="absolute inset-[4%] rounded-full shadow-[0_0_120px_30px_rgba(245,197,66,0.35)]" />
        <Image
          src={hero.mark.src}
          alt={hero.mark.alt}
          fill
          priority
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 240px, 170px"
          className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        />
      </div>
    </div>
  );
}
