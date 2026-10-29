import { pageMeta } from "@/lib/seo";
import { roadmapMeta } from "@/data/content/roadmap";
import { RoadmapHero } from "@/components/roadmap/RoadmapHero";
import { Timeline } from "@/components/roadmap/Timeline";

export const metadata = pageMeta(roadmapMeta);

export default function RoadmapPage() {
  return (
    <>
      <RoadmapHero />
      <Timeline />
    </>
  );
}
