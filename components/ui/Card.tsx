"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { SmartLink } from "./Button";

/**
 * Surface card: hover lifts 4px, border brightens, and a gold radial follows the cursor
 * (CSS vars --mx/--my consumed by `.card-glow::before` in globals.css).
 * Pass `href` to make the whole card a link.
 */
export function Card({
  children,
  className,
  href,
  ariaLabel,
  padded = true,
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  ariaLabel?: string;
  padded?: boolean;
  interactive?: boolean;
}) {
  const onMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  const cls = cn(
    "relative block overflow-hidden rounded-lg border border-line bg-surface",
    padded && "p-8",
    interactive &&
      "card-glow transition-[transform,border-color,box-shadow] duration-500 ease-quint hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_0_80px_rgba(245,197,66,0.08)]",
    className,
  );

  if (href) {
    return (
      <SmartLink href={href} className={cn(cls, "group")} onPointerMove={onMove} aria-label={ariaLabel}>
        {children}
      </SmartLink>
    );
  }
  return (
    <div className={cn(cls, "group")} onPointerMove={interactive ? onMove : undefined}>
      {children}
    </div>
  );
}
