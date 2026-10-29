"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type LenisLike = { scrollTo: (target: number) => void };
/** 72px header + 16px breathing room. */
const HEADER_OFFSET = 88;

/** Smooth-scrolls to an element id, through Lenis when it is running (offset clears the 72px header). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Explicit pixel target: Lenis would otherwise stack its offset on top of the CSS scroll-padding / scroll-margin.
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
  return true;
}

/**
 * Link to a home-page anchor such as "/#rwa". On the home page it smooth-scrolls in place;
 * on any other page it navigates home and Next scrolls to the hash.
 */
export function AnchorLink({
  href,
  className,
  children,
  onNavigate,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const target = path || "/";

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        const inPage = hash && pathname === target && !e.metaKey && !e.ctrlKey && !e.shiftKey;
        if (inPage && document.getElementById(hash)) {
          e.preventDefault();
          onNavigate?.();
          // Let a closing overlay release its scroll lock first.
          window.setTimeout(() => scrollToId(hash), onNavigate ? 60 : 0);
          return;
        }
        onNavigate?.();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
