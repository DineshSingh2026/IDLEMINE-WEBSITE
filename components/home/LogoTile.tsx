import Image from "next/image";
import { cn } from "@/lib/utils";

/** Glassy brand tile: logo mark + spaced wordmark, tinted glow behind the mark. */
export function LogoTile({
  src,
  wordmark,
  glow,
  className,
}: {
  src: string;
  wordmark: string;
  /** CSS color for the glow behind the mark */
  glow: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-2.5 pr-5 backdrop-blur-md",
        className,
      )}
    >
      <span className="relative flex size-11 items-center justify-center rounded-xl border border-white/10 bg-bg/80">
        <span aria-hidden className="absolute inset-0 rounded-xl opacity-60 blur-md" style={{ background: glow }} />
        <Image src={src} alt="" width={28} height={28} sizes="28px" className="relative size-7 object-contain" />
      </span>
      <span className="font-display text-[15px] font-bold tracking-[0.28em] text-ink">{wordmark}</span>
    </div>
  );
}
