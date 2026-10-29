import { ArrowUpRight } from "lucide-react";
import type { MenuItem } from "@/data/content/landing";
import { SmartLink } from "@/components/ui/Button";
import { cn, isExternal } from "@/lib/utils";

export function SoonBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border border-line whitespace-nowrap px-2 text-[11px] font-medium text-ink-3",
        className,
      )}
    >
      Coming Soon
    </span>
  );
}

/**
 * One row of a nav dropdown / mobile accordion: label + small description + ↗.
 * `soon` (or no href) renders a non-interactive, greyed row with a Coming Soon badge.
 */
export function NavRow({
  item,
  onNavigate,
  className,
}: {
  item: MenuItem;
  onNavigate?: () => void;
  className?: string;
}) {
  const row = "flex w-full items-center justify-between gap-4 rounded-[12px] px-3 py-2.5";

  if (item.soon || !item.href) {
    return (
      <div aria-disabled="true" className={cn(row, "cursor-default select-none", className)}>
        <span className="min-w-0 text-[15px] font-medium leading-5 text-ink-3">{item.label}</span>
        <SoonBadge />
      </div>
    );
  }

  const external = isExternal(item.href);
  return (
    <SmartLink
      href={item.href}
      onClick={onNavigate}
      data-nav-item=""
      className={cn(
        row,
        "group/row outline-offset-0 transition-colors duration-200 ease-out hover:bg-surface-2 focus-visible:bg-surface-2",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-5 text-ink">{item.label}</span>
        {item.desc && <span className="mt-0.5 block text-[13px] leading-[18px] text-ink-3">{item.desc}</span>}
      </span>
      {external && (
        <>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-ink-3 transition-[color,transform] duration-200 ease-out group-hover/row:-translate-y-px group-hover/row:translate-x-px group-hover/row:text-teal-400 group-focus-visible/row:text-teal-400"
          />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </SmartLink>
  );
}
