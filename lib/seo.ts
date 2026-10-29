import type { Metadata } from "next";
import { SITE_URL } from "@/data/content/site";

/** Per-page metadata: title, description, canonical, OG + Twitter summary_large_image. */
export function pageMeta({
  title,
  description,
  path,
  og,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  og: string;
  ogTitle?: string;
}): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url || SITE_URL },
    openGraph: {
      type: "website",
      siteName: "IdleMine",
      title: ogTitle ?? title,
      description,
      url: url || SITE_URL,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: ogTitle ?? title, description, images: [og] },
  };
}
