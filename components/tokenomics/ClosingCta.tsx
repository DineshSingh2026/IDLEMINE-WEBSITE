import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Grain } from "@/components/layout/Grain";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { closing, hero } from "@/data/content/tokenomics";

export function ClosingCta() {
  return (
    <section aria-labelledby="tk-closing" className="relative isolate overflow-hidden py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,rgba(245,197,66,0.45),transparent_60%),radial-gradient(ellipse_60%_60%_at_10%_20%,rgba(153,69,255,0.45),transparent_60%),radial-gradient(ellipse_50%_60%_at_95%_30%,rgba(20,241,149,0.22),transparent_60%),linear-gradient(180deg,#07061F,#120B3A)]" />
        <div className="dot-grid absolute inset-0" />
        <Grain />
        <Image src={hero.mark.src} alt="" width={640} height={640} className="absolute left-1/2 top-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.07]" />
      </div>
      <Container className="text-center">
        <Heading id="tk-closing" size="xl" className="mx-auto" highlight={["Own."]}>
          {closing.title}
        </Heading>
        <Reveal delay={0.2} className="mt-12 flex flex-wrap justify-center gap-3">
          {closing.ctas.map((c) => (
            <Button key={c.label} href={c.href} variant={c.variant}>
              {c.label}
            </Button>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
