import type { Metadata, Viewport } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SITE_URL, socials } from "@/data/content/site";
import "./globals.css";

/* Typography mirrors solana.com: ABC Diatype (sans) + ABC Diatype Semi-Mono (labels), both licensed
   Dinamo faces. Geist / Geist Mono (OFL) are the free stand-ins until the licensed files are dropped
   into public/fonts/ — see public/fonts/abc-diatype*.css. Stacks live in app/globals.css (:root). */
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

// The licensed @font-face sheets are linked only when their files exist, so nothing 404s before then.
const fontsDir = join(process.cwd(), "public", "fonts");
const hasDiatype = existsSync(join(fontsDir, "ABCDiatype-Regular.woff2"));
const hasDiatypeMono = existsSync(join(fontsDir, "ABCDiatypeSemi-Mono-Regular.woff2"));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "$IDLE · Powering the human and Agentic Economies", template: "%s" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/img/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/img/favicon-64.png", type: "image/png", sizes: "64x64" },
    ],
    apple: "/assets/img/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#05080A",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IdleMine",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/img/idlemine-logo.png`,
    email: "support@idlemine.io",
    sameAs: socials.map((s) => s.href),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "IdleMine",
    url: SITE_URL,
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        {hasDiatype && <link rel="stylesheet" href="/fonts/abc-diatype.css" precedence="default" />}
        {hasDiatypeMono && <link rel="stylesheet" href="/fonts/abc-diatype-semi-mono.css" precedence="default" />}
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
