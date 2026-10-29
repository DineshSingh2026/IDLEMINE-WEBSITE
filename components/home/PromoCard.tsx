import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { promo } from "@/data/content/home";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { SmartLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { GoldText } from "./GoldText";

/** Wide partnership-style card (à la Solana × Samsung Wallet): logo stage left, copy right. */
export function PromoCard() {
  return (
    <section aria-labelledby="promo-title" className="relative isolate pb-8 pt-4 md:pb-12">
      <Container>
        <Reveal>
          <SmartLink
            href={promo.link.href}
            className="group relative block rounded-xl bg-gradient-to-r from-[#19d3ff]/40 via-white/10 to-gold/40 p-px transition-shadow duration-700 ease-quint hover:shadow-[0_0_120px_-20px_rgba(25,211,255,0.35)]"
          >
            <div className="relative grid overflow-hidden rounded-[31px] bg-[#0a0d17] md:grid-cols-[minmax(0,380px)_1fr]">
              {/* Logo stage */}
              <div className="relative flex items-center justify-center overflow-hidden px-8 py-12 md:py-14">
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(25,211,255,0.28),transparent_62%)]" />
                <div aria-hidden className="dot-grid absolute inset-0 opacity-50" />
                <div aria-hidden className="absolute inset-y-0 right-0 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
                <Image
                  src={promo.logo}
                  alt={promo.logoAlt}
                  width={180}
                  height={180}
                  sizes="180px"
                  className="relative size-32 drop-shadow-[0_0_40px_rgba(25,211,255,0.45)] transition-transform duration-700 ease-quint group-hover:scale-[1.06] md:size-40"
                />
              </div>

              {/* Copy */}
              <div className="relative flex flex-col justify-center gap-5 px-8 pb-10 md:px-12 md:py-14">
                <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-gold/15 blur-[90px]" />
                <div className="flex flex-wrap items-center gap-3">
                  <h2 id="promo-title" className="text-display-s text-ink">
                    {promo.title}
                  </h2>
                  <Badge status="live">{promo.badge}</Badge>
                </div>
                <p className="text-body-l max-w-[560px]">
                  <GoldText text={promo.body} />
                </p>
                <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors group-hover:text-gold-2">
                  {promo.link.label}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </div>
          </SmartLink>
        </Reveal>
      </Container>
    </section>
  );
}
