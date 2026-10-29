import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/utils";
import { AnchorLink } from "@/components/layout/nav/AnchorLink";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] select-none";

const variants: Record<Variant, string> = {
  primary: "rounded-[12px] bg-teal-500 text-[#05080A] hover:bg-teal-400 hover:shadow-[0_8px_28px_-10px_rgba(0,198,201,0.65)] active:bg-teal-600 active:shadow-none",
  secondary: "rounded-[12px] border border-line-strong text-ink hover:border-teal-300/60 hover:bg-white/[0.04]",
  ghost: "text-teal-400 hover:text-teal-300",
};
const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[15px]",
  sm: "h-10 px-4 text-sm",
};

export type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** "arrow" → slides right on hover; "external" → ↗; "none" */
  icon?: "arrow" | "external" | "none";
  ariaLabel?: string;
};

/** Link-styled button. Absolute URLs open in a new tab with rel="noopener noreferrer". */
export function Button({ href, children, variant = "primary", size = "md", className, icon, ariaLabel }: ButtonProps) {
  const external = isExternal(href);
  const resolvedIcon = icon ?? (external ? "external" : "arrow");
  const ghost = variant === "ghost";

  const content = (
    <>
      <span className={cn(ghost && "relative")}>
        {children}
        {ghost && (
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-quint group-hover/btn:scale-x-100"
          />
        )}
      </span>
      {resolvedIcon === "arrow" && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-quint group-hover/btn:translate-x-1"
        />
      )}
      {resolvedIcon === "external" && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-quint group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  const cls = cn(base, variants[variant], !ghost && sizes[size], className);

  if (href.includes("#") && !external) {
    // In-page / home-page anchor: smooth-scroll with the header offset (see AnchorLink).
    return (
      <AnchorLink href={href} className={cls} aria-label={ariaLabel}>
        {content}
      </AnchorLink>
    );
  }
  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

/** Plain link that applies the external-link rules (new tab + rel) automatically. */
export function SmartLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: React.ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  if (isExternal(href) || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
