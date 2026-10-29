import { HeroCoin } from "@/components/hero/HeroCoin";

/** Hero coin stage: halo rings + glow behind the 3D coin. */
export function HeroVisual() {
  return (
    <div className="relative aspect-square w-full">
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(245,197,66,0.22)_0%,rgba(153,69,255,0.14)_45%,transparent_70%)] blur-2xl" />
      <div aria-hidden className="absolute inset-[4%] rounded-full border border-white/[0.06]" />
      <div aria-hidden className="absolute inset-[16%] rounded-full border border-gold/10" />
      <div aria-hidden className="absolute inset-x-[18%] bottom-[6%] h-[10%] rounded-[50%] bg-violet/30 blur-2xl" />
      <HeroCoin className="absolute inset-0" />
    </div>
  );
}
