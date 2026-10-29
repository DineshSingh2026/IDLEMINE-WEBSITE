import Image from "next/image";
import { cn } from "@/lib/utils";

type Asset = { name: string; ticker: string; logo: string };

/** One cell of the RWA tile row: full-colour token in a round frame, pair name + asset name. */
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
      className={cn(
        "group/tile relative flex h-full flex-col items-center gap-5 px-3 pt-7 pb-6 text-center transition-colors duration-[250ms] ease-out md:pt-8 md:pb-7",
        active ? "bg-surface" : "bg-bg/70",
      )}
    >
      {/* top hairline lights up while this pair is active */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="relative block size-14 md:size-16">
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full bg-teal-400/35 blur-lg transition-opacity duration-300 ease-out",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <span
          className={cn(
            "relative block size-full overflow-hidden rounded-full ring-1 transition-[transform,box-shadow] duration-300 ease-out",
            active ? "-translate-y-1 ring-teal-300/80" : "ring-white/12",
          )}
        >
          <Image src={asset.logo} alt={`${asset.name} tokenized asset logo`} width={144} height={144} sizes="64px" className="size-full" />
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.24),transparent_45%)]" />
        </span>
      </span>
      <span className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-[13px] leading-5 tracking-tight whitespace-nowrap text-ink tabular-nums md:text-sm">
          {asset.ticker}
          <span className={cn("transition-colors duration-[250ms]", active ? "text-teal-400" : "text-ink-3")}>{pairSuffix}</span>
        </span>
        <span className="text-[13px] leading-5 text-ink-3">{asset.name}</span>
      </span>
    </div>
  );
}
