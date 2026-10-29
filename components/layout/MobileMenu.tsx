"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { nav, socials } from "@/data/content/site";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { EASE } from "@/components/ui/Reveal";

/** Full-screen overlay menu; items stagger in at 40ms. Esc closes, focus moves into the dialog. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-bg/98 backdrop-blur-2xl md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="pointer-events-none absolute -top-40 right-[-30%] size-[520px] rounded-full bg-gold/20 blur-[120px]" />
          <div className="flex h-[72px] items-center justify-between px-6">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <Image src="/assets/img/idlemine-mark.webp" alt="" width={32} height={32} className="size-8" />
              <span className="font-display text-[19px] font-bold tracking-[-0.02em]">{nav.brand}</span>
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <motion.ul
            className="flex flex-1 flex-col justify-center gap-2 px-6"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
          >
            {[{ label: "Home", href: "/" }, ...nav.items].map((item) => (
              <motion.li
                key={item.href}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-2 font-display text-[44px] font-bold leading-none tracking-[-0.03em] text-ink"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div
            className="space-y-6 px-6 pb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6, ease: EASE } }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button href={nav.play.href} variant="secondary" icon="none">
                {nav.play.label}
              </Button>
              <Button href={nav.buy.href}>{nav.buy.label}</Button>
            </div>
            <ul className="flex gap-3">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink-2"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
