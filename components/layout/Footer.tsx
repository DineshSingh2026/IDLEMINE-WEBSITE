import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { footer, links, nav, socials } from "@/data/content/site";
import { SmartLink } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { isExternal } from "@/lib/utils";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-bg">
      <div aria-hidden className="pointer-events-none absolute -bottom-64 left-1/2 -z-10 h-[480px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet/20 via-gold/15 to-mint/15 blur-[140px]" />

      <div className="border-b border-line bg-white/[0.015]">
        <Container className="flex gap-3 py-5 text-[13px] leading-relaxed text-ink-3">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            <strong className="font-semibold text-ink-2">{footer.disclaimer.lead}</strong> {footer.disclaimer.body}
          </p>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="IdleMine home">
            <Image src="/assets/img/idlemine-mark.webp" alt="" width={36} height={36} className="size-9" />
            <span className="font-display text-xl font-bold tracking-[-0.02em]">{nav.brand}</span>
          </Link>
          <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{footer.tagline}</p>
          <ul className="mt-6 flex gap-2.5">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                >
                  <SocialIcon name={s.key} />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
            <a href={`mailto:${footer.contact.email}`} className="text-ink-2 hover:text-ink">
              {footer.contact.email}
            </a>
            <br />
            {footer.contact.address}
          </p>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-eyebrow">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <SmartLink
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-[15px] text-ink-2 transition-colors hover:text-ink"
                  >
                    {l.label}
                    {isExternal(l.href) && (
                      <ArrowUpRight aria-hidden className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                    )}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <Container className="flex flex-col gap-4 border-t border-line py-6 text-[13px] text-ink-3 lg:flex-row lg:items-center lg:justify-between">
        <span>{footer.copyright}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="shrink-0">Contract</span>
          <CopyAddress />
        </span>
        <a
          href={links.dexscreener}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-ink"
        >
          {footer.dataCredit}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </a>
      </Container>
    </footer>
  );
}
