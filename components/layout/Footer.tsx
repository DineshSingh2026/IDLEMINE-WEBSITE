import { footerCols, legal, type MenuItem } from "@/data/content/landing";
import { footer, socials } from "@/data/content/site";
import { SmartLink } from "@/components/ui/Button";
import { CopyAddress } from "@/components/ui/CopyAddress";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { isExternal } from "@/lib/utils";
import { Container } from "./Container";
import { AnchorLink } from "./nav/AnchorLink";
import { Logo } from "./nav/Logo";

const linkCls =
  "inline-flex items-center gap-2.5 text-[14px] leading-5 text-ink-2 transition-colors duration-200 ease-out hover:text-ink";

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[12px] font-medium uppercase leading-4 tracking-[0.08em] text-ink-3">{children}</h2>
  );
}

function FooterLink({ item }: { item: MenuItem }) {
  if (item.soon || !item.href) {
    return (
      <span aria-disabled="true" className="text-[14px] leading-5 text-ink-3/70">
        {item.label}
        <span className="ml-2 whitespace-nowrap align-[1px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
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

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <Container className="grid gap-x-6 gap-y-12 pb-14 pt-16 lg:grid-cols-12 lg:pb-16 lg:pt-20">
        {/* Official contract */}
        <div className="lg:col-span-3">
          <ColTitle>Official contract address</ColTitle>
          <div className="mt-5 inline-flex max-w-full items-center gap-3 rounded-[12px] border border-line bg-surface py-1.5 pl-3.5 pr-1.5">
            <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3">$IDLE</span>
            <span aria-hidden className="h-4 w-px bg-line" />
            <CopyAddress compact className="min-w-0" />
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
                    <SocialIcon name={s.key} className="size-4 text-ink-3 transition-colors duration-200 group-hover/s:text-ink" />
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
        <div className="border-t border-line py-8">
          <p className="max-w-[920px] text-[12px] leading-[19px] text-ink-3">
            <span className="font-medium text-ink-2">{footer.disclaimer.lead}</span> {footer.disclaimer.body}
          </p>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-5 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[13px] text-ink-3">© 2026 IdleMine</span>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-ink-3 transition-colors duration-200 ease-out hover:text-ink"
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
