import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { closing, hero } from "@/data/content/tokenomics";

export function ClosingCta() {
  return (
    <section aria-labelledby="tk-closing" className="relative pb-16 md:pb-24 lg:pb-[120px]">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface px-6 py-16 text-center md:px-12 md:py-24">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,#018082,#00C6C9,#3DF5B0)]" />
          <Reveal>
            <span className="mx-auto block size-14 rounded-full border border-line bg-surface-2 p-2">
              <Image src={hero.mark.src} alt="" width={56} height={56} className="size-full object-contain" />
            </span>
          </Reveal>
          <Heading id="tk-closing" size="xl" className="mx-auto mt-8">
            {closing.title}
          </Heading>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap justify-center gap-3">
            {closing.ctas.map((c) => (
              <Button key={c.label} href={c.href} variant={c.variant}>
                {c.label}
              </Button>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
