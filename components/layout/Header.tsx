"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { nav } from "@/data/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[72px] border-b transition-[background-color,border-color] duration-500 ease-quint",
          solid ? "border-line bg-bg/95 backdrop-blur-xl" : "border-transparent bg-bg/70 backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5" aria-label="IdleMine home">
            <Image src="/assets/img/idlemine-mark.webp" alt="" width={32} height={32} priority className="size-8" />
            <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-ink">{nav.brand}</span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center px-4 text-[15px] font-medium transition-colors",
                        active ? "text-ink" : "text-ink-2 hover:text-ink",
                      )}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 -bottom-[15px] h-[2px] rounded-full bg-gold"
                          transition={{ type: "spring", stiffness: 380, damping: 36 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href={nav.play.href} variant="secondary" size="sm" icon="none" className="hidden lg:inline-flex">
              {nav.play.label}
            </Button>
            <Button href={nav.buy.href} size="sm" className="hidden sm:inline-flex">
              {nav.buy.label}
            </Button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-ink md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
