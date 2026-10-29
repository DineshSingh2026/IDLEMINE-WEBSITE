import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Ecosystem } from "@/components/landing/Ecosystem";
import { Rwa } from "@/components/landing/Rwa";
import { Faq } from "@/components/landing/Faq";

export const metadata: Metadata = pageMeta({
  title: "$IDLE — Powering the human and Agentic Economies",
  description:
    "$IDLE is the token powering human and AI economies. Every transaction across gaming and the agentic economy runs on $IDLE.",
  path: "/",
  og: "/assets/og/home.png",
});

// Page order per the Design Brief: Header → Hero → Stats → Ecosystem → RWA → FAQs → Footer.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Ecosystem />
      <Rwa />
      <Faq />
    </>
  );
}
