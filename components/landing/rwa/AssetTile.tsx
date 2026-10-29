import Image from "next/image";
import { monoFilterId, monoScale } from "./monoFilters";

type Asset = { name: string; ticker: string; logo: string };

/**
 * One cell of the RWA logo wall. At rest: a white monochrome mark inside a round token frame.
 * On hover/focus-within: the full-colour token crossfades in (250ms ease-out).
 */
export function AssetTile({ asset, pairSuffix }: { asset: Asset; pairSuffix: string }) {
  return (
    <div className="group/tile relative flex h-full flex-col items-center gap-5 bg-bg/70 px-3 pt-7 pb-6 text-center md:pt-9 md:pb-8 transition-colors duration-[250ms] ease-out hover:bg-surface">
      <span className="relative block size-14 overflow-hidden rounded-full border border-line bg-surface-2/60 transition-[border-color] duration-[250ms] ease-out group-hover/tile:border-transparent md:size-[72px]">
        {/* Monochrome mark */}
        <Image
          src={asset.logo}
          alt=""
          aria-hidden
          width={144}
          height={144}
          sizes="72px"
          className="absolute inset-0 size-full opacity-80 transition-opacity duration-[250ms] ease-out group-hover/tile:opacity-0"
          style={{ filter: `url(#${monoFilterId(asset.ticker)})`, transform: `scale(${monoScale(asset.ticker)})` }}
        />
        {/* Full colour */}
        <Image
          src={asset.logo}
          alt={`${asset.name} tokenized asset logo`}
          width={144}
          height={144}
          sizes="72px"
          className="absolute inset-0 size-full opacity-0 transition-opacity duration-[250ms] ease-out group-hover/tile:opacity-100"
        />
      </span>
      <span className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-[13px] leading-5 tracking-tight text-ink tabular-nums whitespace-nowrap md:text-sm">
          {asset.ticker}
          <span className="text-ink-3 transition-colors duration-[250ms] group-hover/tile:text-teal-400">{pairSuffix}</span>
        </span>
        <span className="text-[13px] leading-5 text-ink-3">{asset.name}</span>
      </span>
    </div>
  );
}
