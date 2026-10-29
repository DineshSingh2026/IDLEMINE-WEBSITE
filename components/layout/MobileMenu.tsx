"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { header, type MenuItem } from "@/data/content/landing";
import { socials } from "@/data/content/site";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";
import { AnchorLink } from "./nav/AnchorLink";
import { Logo } from "./nav/Logo";
import { NavRow } from "./nav/NavRow";

type LenisLike = { stop: () => void; start: () => void };
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Group({ label, items, onNavigate }: { label: string; items: MenuItem[]; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex h-16 w-full items-center justify-between text-left font-display text-[22px] font-semibold tracking-[-0.02em] text-ink"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={cn("size-5 text-ink-3 transition-transform duration-200 ease-out", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <ul className="-mx-3 pb-4">
              {items.map((item) => (
                <li key={item.label}>
                  <NavRow item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Full-screen menu (< 1024px). Esc closes, body scroll locked, focus trapped, focus returns to the hamburger. */
export function MobileMenu({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    const returnTo = returnFocusRef?.current;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const list = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    // Close if the viewport grows past the mobile breakpoint.
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (e: MediaQueryListEvent) => e.matches && onClose();

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      html.style.overflow = prevOverflow;
      lenis?.start();
      returnTo?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-6">
            <Logo onClick={onClose} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-[12px] border border-line-strong text-ink transition-colors duration-200 hover:bg-white/[0.04]"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <motion.nav
            aria-label="Mobile"
            className="flex-1 overflow-y-auto overscroll-contain px-6"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
          >
            <ul>
              {header.menus.map((m) => (
                <Group key={m.label} label={m.label} items={m.items} onNavigate={onClose} />
              ))}
              <li className="border-b border-line">
                <AnchorLink
                  href={header.rwa.href}
                  onNavigate={onClose}
                  className="flex h-16 items-center font-display text-[22px] font-semibold tracking-[-0.02em] text-ink"
                >
                  {header.rwa.label}
                </AnchorLink>
              </li>
            </ul>
          </motion.nav>

          <div className="shrink-0 space-y-5 border-t border-line px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
            <Button href={header.cta.href} className="w-full">
              {header.cta.label}
            </Button>
            <ul className="flex items-center justify-center gap-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="inline-flex size-11 items-center justify-center rounded-[12px] border border-line text-ink-2 transition-colors duration-200 hover:border-line-strong hover:text-ink"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
