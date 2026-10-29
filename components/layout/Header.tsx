"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { header } from "@/data/content/landing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { AnchorLink } from "./nav/AnchorLink";
import { DesktopDropdown } from "./nav/DesktopDropdown";
import { Logo } from "./nav/Logo";

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    setMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Outside click / Esc closes an open dropdown.
  useEffect(() => {
    if (menu === null) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[72px] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          solid ? "border-line bg-bg/90 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto] items-center gap-6 px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
          <Logo priority />

          <nav ref={navRef} aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {header.menus.map((m, i) => (
                <li key={m.label}>
                  <DesktopDropdown
                    id={`nav-${i}`}
                    label={m.label}
                    items={m.items}
                    open={menu === i}
                    onOpenChange={(v) => setMenu((cur) => (v ? i : cur === i ? null : cur))}
                  />
                </li>
              ))}
              <li>
                <AnchorLink
                  href={header.rwa.href}
                  onNavigate={() => setMenu(null)}
                  className="inline-flex h-10 items-center rounded-[10px] px-3.5 text-[15px] font-medium text-ink-2 transition-colors duration-200 ease-out hover:text-ink"
                >
                  {header.rwa.label}
                </AnchorLink>
              </li>
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Button href={header.cta.href} size="sm" className="max-[359px]:hidden">
              {header.cta.label}
            </Button>
            <button
              ref={burgerRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[12px] border border-line-strong text-ink transition-colors duration-200 hover:bg-white/[0.04] lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={closeMobile} returnFocusRef={burgerRef} />
    </>
  );
}
