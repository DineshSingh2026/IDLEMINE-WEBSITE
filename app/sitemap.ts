import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/ecosystem", "/tokenomics", "/roadmap", "/liquidity"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: p === "" || p === "/liquidity" || p === "/tokenomics" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
