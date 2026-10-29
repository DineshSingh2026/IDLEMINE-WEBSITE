import type { Viewport } from "next";
import { pageMeta } from "@/lib/seo";
import { getTokenStats } from "@/lib/market";
import { tokenomicsMeta } from "@/data/content/tokenomics";
import { TokenomicsHero } from "@/components/tokenomics/TokenomicsHero";
import { TokenGlance } from "@/components/tokenomics/TokenGlance";
import { UtilityGrid } from "@/components/tokenomics/UtilityGrid";
import { FlowDiagram } from "@/components/tokenomics/FlowDiagram";
import { FlywheelPipeline } from "@/components/tokenomics/FlywheelPipeline";
import { WhyItMatters } from "@/components/tokenomics/WhyItMatters";
import { HowToBuy } from "@/components/tokenomics/HowToBuy";
import { ClosingCta } from "@/components/tokenomics/ClosingCta";
import { tokenomicsCss } from "@/components/tokenomics/styles";

export const metadata = pageMeta(tokenomicsMeta);
export const viewport: Viewport = { themeColor: "#07061f" };
export const revalidate = 60;

export default async function TokenomicsPage() {
  const stats = await getTokenStats();
  return (
    <div className="bg-bg-deep">
      <style dangerouslySetInnerHTML={{ __html: tokenomicsCss }} />
      <TokenomicsHero />
      <TokenGlance initial={stats} />
      <UtilityGrid />
      <FlowDiagram />
      <FlywheelPipeline />
      <WhyItMatters />
      <HowToBuy />
      <ClosingCta />
    </div>
  );
}
