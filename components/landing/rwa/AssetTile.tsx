import Image from "next/image";
import { cn } from "@/lib/utils";

type Asset = { name: string; ticker: string; logo: string };

/** One asset in the RWA row: full colour round token, pair name + asset name. No outline, light only. */
export function AssetTile({
  asset,
  pairSuffix,
  active = false,
  onActive,
}: {
  asset: Asset;
  pairSuffix: string;
  active?: boolean;
  onActive?: (ticker: string | null) => void;
}) {
  return (
    <div
      onPointerEnter={() => onActive?.(asset.ticker)}
      onPointerLeave={() => onActive?.(null)}
      className="group/tile relative flex flex-col items-center gap-3 px-1 text-center sm:gap-4 sm:px-2"
    >
      <span className="relative block size-12 sm:size-14 md:size-16">
        <span
          aria-hidden
          className={cn(
            "absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.55),rgba(0,198,201,0.12)_50%,transparent_72%)] transition-opacity duration-300 ease-out",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <span
          className={cn(
            "relative block size-full overflow-hidden rounded-full ring-1 transition-[transform,box-shadow] duration-300 ease-out",
            active ? "-translate-y-1 ring-teal-300/80 shadow-[0_10px_30px_-8px_rgba(0,198,201,0.6)]" : "ring-white/10",
          )}
        >
          <Image src={asset.logo} alt={`${asset.name} tokenized asset logo`} width={144} height={144} sizes="64px" className="size-full" />
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.24),transparent_45%)]" />
        </span>
      </span>
      <span className="flex flex-col items-center gap-1">
        <span className="font-mono text-[11px] leading-5 tracking-[-0.02em] whitespace-nowrap sm:text-[13px] sm:tracking-tight text-ink tabular-nums md:text-sm">
          {asset.ticker}
          <span className={cn("transition-colors duration-[250ms]", active ? "text-mint" : "text-teal-400/80")}>{pairSuffix}</span>
        </span>
        <span className="text-[12px] leading-5 text-ink-3 sm:text-[13px]">{asset.name}</span>
      </span>
      {/* small glowing underline while this pair is active, fades at both ends */}
      <span
        aria-hidden
        className={cn(
          "h-px w-12 bg-[linear-gradient(90deg,transparent,#00C6C9,#3DF5B0,transparent)] transition-[opacity,transform] duration-300 ease-out",
          active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0",
        )}
      />
    </div>
  );
}
