import Image from "next/image";
import Link from "next/link";
import { nav } from "@/data/content/site";
import { cn } from "@/lib/utils";

/** IdleMine mark + wordmark. Always on bg-void / surface-1, never recoloured or shadowed. */
export function Logo({ onClick, className, priority }: { onClick?: () => void; className?: string; priority?: boolean }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("flex w-fit shrink-0 items-center gap-2.5 rounded-[8px]", className)}
      aria-label="IdleMine home"
    >
      <Image src="/assets/img/idlemine-mark.webp" alt="" width={32} height={32} priority={priority} className="size-8" />
      <span className="font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">{nav.brand}</span>
    </Link>
  );
}

