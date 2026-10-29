import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { hero } from "@/data/content/tokenomics";

const delay = (s: number) => ({ animationDelay: `${s}s` });

/** Hero — server-rendered; motion is pure CSS so the H1 is readable before hydration. */
export function TokenomicsHero() {
  const words = hero.title.split(" ");
  return (
    <section aria-labelledby="tk-hero-title" className="relative isolate overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="relative z-10 max-w-[720px] lg:col-span-7">
          <div className="tk-in" style={delay(0)}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>
          <h1 id="tk-hero-title" className="text-display-xl mt-6 text-balance text-ink">
            {words.map((w, i) => (
              <span key={i}>
                {i > 0 ? " " : null}
                <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                  <span className={"tk-word " + (w === "Ownership" ? "text-grad-brand" : "")} style={delay(0.06 + i * 0.05)}>
                    {w}
                  </span>
                </span>
              </span>
            ))}
          </h1>
          <p className="tk-in mt-8 font-display text-xl font-medium tracking-[-0.01em] text-ink md:text-2xl" style={delay(0.3)}>
            {hero.kicker}
          </p>
          <p className="tk-in text-body-l mt-4 max-w-[560px]" style={delay(0.36)}>
            {hero.sub}
          </p>
          <div className="tk-in mt-10 flex flex-wrap gap-3" style={delay(0.42)}>
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

/** Token mark inside precise hairline rings; one slow orbit, no halos or shadows. */
function HeroMark() {
  return (
    <div
      className="tk-in relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[380px] lg:col-span-5 lg:max-w-[460px]"
      style={delay(0.15)}
    >
      <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
        <circle cx="200" cy="200" r="196" fill="none" stroke="#1C2A2F" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="#1C2A2F" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="124" fill="none" stroke="#1C2A2F" />
        {/* Tick marks on the outer ring */}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 196;
          const r2 = i % 6 === 0 ? 184 : 190;
          return (
            <line
              key={i}
              x1={200 + r1 * Math.cos(a)}
              y1={200 + r1 * Math.sin(a)}
              x2={200 + r2 * Math.cos(a)}
              y2={200 + r2 * Math.sin(a)}
              stroke={i % 6 === 0 ? "#4D666C" : "#1C2A2F"}
            />
          );
        })}
        <g className="tk-spin" style={{ transformOrigin: "200px 200px" }}>
          <path d="M200,4 A196,196 0 0,1 396,200" fill="none" stroke="#00C6C9" strokeOpacity="0.7" strokeWidth="1.25" />
          <circle cx="396" cy="200" r="3" fill="#00C6C9" />
        </g>
      </svg>
      <div className="absolute inset-[26%]">
        <Image
          src={hero.mark.src}
          alt={hero.mark.alt}
          fill
          priority
          sizes="(min-width: 1024px) 230px, (min-width: 640px) 190px, 140px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
