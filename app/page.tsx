import { homeMeta, tickerFields } from "@/data/content/home";
import { getTokenStats } from "@/lib/market";
import { pageMeta } from "@/lib/seo";
import { TickerBand } from "@/components/home/TickerBand";
import { HeroHome } from "@/components/home/HeroHome";
import { PromoCard } from "@/components/home/PromoCard";
import { MidEarthSection } from "@/components/home/MidEarthSection";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { AgenticEconomy } from "@/components/home/AgenticEconomy";
import { RoadmapTeaser } from "@/components/home/RoadmapTeaser";
import { CommunitySection } from "@/components/home/CommunitySection";

export const revalidate = 60;
export const metadata = pageMeta(homeMeta);

export default async function HomePage() {
  const stats = await getTokenStats();
  return (
    <>
      <TickerBand fields={tickerFields} initial={stats} />
      <HeroHome />
      <PromoCard />
      <MidEarthSection />
      <EcosystemSection />
      <AgenticEconomy />
      <RoadmapTeaser />
      <CommunitySection />
    </>
  );
}
