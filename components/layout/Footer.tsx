import { footerCols, legal, type MenuItem } from "@/data/content/landing";
import { footer, socials } from "@/data/content/site";
import { SmartLink } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn, isExternal } from "@/lib/utils";
import { Container } from "./Container";
import { AnchorLink } from "./nav/AnchorLink";
import { Logo } from "./nav/Logo";

const linkCls =
  "inline-flex items-center gap-2.5 text-[14px] leading-5 text-ink-2 transition-colors duration-200 ease-out hover:text-teal-300";

/** Hairline that fades out at both ends (never a closed rectangle). */
function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-[linear-gradient(90deg,transparent,rgba(0,198,201,0.28)_20%,rgba(77,217,219,0.18)_55%,rgba(155,123,255,0.22)_80%,transparent)]",
        className,
      )}
    />
  );
}

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[12px] font-medium uppercase leading-4 tracking-[0.08em] text-teal-400">{children}</h2>
  );
}

function FooterLink({ item }: { item: MenuItem }) {
  if (item.soon || !item.href) {
    return (
      <span aria-disabled="true" className="text-[14px] leading-5 text-ink-3/70">
        {item.label}
        <span className="ml-2 whitespace-nowrap align-[1px] font-mono text-[10px] uppercase tracking-[0.08em] text-violet/80">
          Soon
        </span>
      </span>
    );
  }
  if (item.href.includes("#") && !isExternal(item.href)) {
    return (
      <AnchorLink href={item.href} className={linkCls}>
        {item.label}
      </AnchorLink>
    );
  }
  return (
    <SmartLink href={item.href} className={linkCls}>
      {item.label}
      {isExternal(item.href) && <span className="sr-only">(opens in a new tab)</span>}
    </SmartLink>
  );
}

/** Site footer: typography, spacing and fading hairlines only. No chips, bands or bordered blocks. */
export function Footer() {
  return (
    <footer className="relative isolate">
      <Container>
        <Hairline />
      </Container>

      <Container className="grid gap-x-6 gap-y-12 pt-16 pb-12 md:pt-20 lg:grid-cols-12 lg:pt-24 lg:pb-16">
        {/* Brand + official contract */}
        <div className="lg:col-span-3">
          <Logo />
          <div className="mt-8">
            <ColTitle>Official contract address</ColTitle>
            <div className="mt-4 flex max-w-full items-center gap-3">
              <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.08em] text-mint">$IDLE</span>
              <CopyAddress compact className="min-w-0" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[1fr_1.5fr_1.2fr_0.9fr] lg:col-span-9">
          {footerCols.map((col) => (
            <nav key={col.title} aria-label={col.title} className={col.links.length > 4 ? "max-sm:col-span-2" : undefined}>
              <ColTitle>{col.title}</ColTitle>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink item={l} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Community">
            <ColTitle>Community</ColTitle>
            <ul className="mt-5 space-y-3.5">
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={`group/s ${linkCls}`}>
                    <span aria-hidden className="-my-1.5 flex size-8 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(0,198,201,0.2),rgba(0,198,201,0.04)_70%)] text-teal-300 transition-[box-shadow,color] duration-200 group-hover/s:text-teal-100 group-hover/s:shadow-[0_0_16px_rgba(0,198,201,0.45)]">
                      <SocialIcon name={s.key} className="size-4" />
                    </span>
                    {s.label}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <Container>
        <Hairline />
        <p className="max-w-[920px] py-8 text-[12px] leading-[19px] text-ink-3">
          <span className="font-medium text-teal-300">{footer.disclaimer.lead}</span> {footer.disclaimer.body}
        </p>
        <Hairline />
        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13px] text-ink-3">© 2026 IdleMine</span>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-ink-3 transition-colors duration-200 ease-out hover:text-teal-300"
                >
                  {l.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
