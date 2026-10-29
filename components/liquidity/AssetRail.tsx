import Image from "next/image";
import { LogoRail } from "@/components/ui/LogoRail";
import { rwaAssets } from "@/data/content/liquidity";

/**
 * Looping marquee of tokenized real-world assets. The official xStocks logos are full-bleed square
 * tiles, so they're rendered as discs: greyscale at 70% → full colour on hover.
 */
export function AssetRail() {
  return (
    <LogoRail
      label="Tokenized real-world assets"
      duration={36}
      items={rwaAssets.map((a) => (
        <div
          key={a.ticker}
          className="group flex h-14 items-center gap-3 rounded-full border border-line bg-surface py-2 pl-2 pr-5 transition-colors duration-200 ease-out hover:border-line-strong"
        >
          <Image
            src={a.logo}
            alt=""
            width={40}
            height={40}
            sizes="40px"
            className="size-10 rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-medium text-ink">{a.name}</span>
            <span className="font-mono text-xs text-ink-3">{a.ticker}</span>
          </span>
        </div>
      ))}
    />
  );
}
