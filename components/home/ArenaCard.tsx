import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SmartLink } from "@/components/ui/Button";

export type Arena = { image: string; alt: string; title: string; body: string; href: string };

/** Portrait arena card — whole card links out; art slowly zooms on hover. */
export function ArenaCard({ arena, badge }: { arena: Arena; badge: string }) {
  return (
    <SmartLink
      href={arena.href}
      className="group relative block overflow-hidden rounded-lg border border-white/10 bg-surface transition-[transform,border-color,box-shadow] duration-500 ease-quint hover:-translate-y-1 hover:border-mint/40 hover:shadow-[0_30px_80px_-30px_rgba(61,245,176,0.35)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={arena.image}
          alt={arena.alt}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1200ms] ease-quint group-hover:scale-[1.08]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-[#06080d]/40 to-transparent" />
        <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-quint group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_100%,rgba(61,245,176,0.25),transparent_60%)]" />
        <Badge status="alpha" className="absolute left-4 top-4 backdrop-blur-md">
          {badge}
        </Badge>
        <span
          aria-hidden
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-ink backdrop-blur-md transition-colors duration-300 group-hover:border-mint/50 group-hover:text-mint"
        >
          <ArrowUpRight className="size-4" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-heading-s text-ink">{arena.title}</h3>
          <p className="mt-1.5 text-[15px] leading-snug text-ink-2">{arena.body}</p>
        </div>
      </div>
    </SmartLink>
  );
}
