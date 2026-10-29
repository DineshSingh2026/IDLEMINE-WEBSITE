import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn, isExternal } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-quint active:scale-[0.98] select-none";

const variants: Record<Variant, string> = {
  primary: "rounded-full bg-gold text-[#0B0B0F] hover:bg-gold-2 shadow-[0_0_0_1px_rgba(245,197,66,0.4),0_8px_32px_-8px_rgba(245,197,66,0.55)]",
  secondary: "rounded-full border border-line-strong text-ink hover:bg-white/5 hover:border-white/25",
  ghost: "text-ink hover:text-gold-2",
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
