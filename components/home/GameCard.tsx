import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type MobileGame = { image: string; alt: string; tag: string; title: string; body: string; link: string; href: string };

/** Mobile game card: art on top, tag, title, one-liner, "Explore Game ↗". Whole card links to Play Store. */
export function GameCard({ game, accent }: { game: MobileGame; accent: "violet" | "gold" }) {
  return (
    <Card href={game.href} padded={false} className="h-full bg-surface/80 backdrop-blur-sm">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={game.image}
          alt={game.alt}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1200ms] ease-quint group-hover:scale-[1.06]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
      </div>
      <div className="relative p-6 md:p-7">
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
            accent === "violet" ? "border-violet/40 bg-violet/15 text-[#C4B2FF]" : "border-gold/40 bg-gold/10 text-gold-2",
          )}
        >
          {game.tag}
        </span>
        <h3 className="text-heading-s mt-4 text-ink">{game.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{game.body}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink transition-colors group-hover:text-gold-2">
          {game.link}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-300 ease-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Card>
  );
}
