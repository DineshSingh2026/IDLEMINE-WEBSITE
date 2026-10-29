import { cn } from "@/lib/utils";

/**
 * Infinite marquee (duplicated track, 40s linear, pauses on hover). Items render twice;
 * the second copy is aria-hidden. Wrap each item's logo in `.rail-logo` for the
 * monochrome-white-70% → full-color-on-hover treatment.
 */
export function LogoRail({
  items,
  className,
  duration = 40,
  label,
}: {
  items: React.ReactNode[];
  className?: string;
  duration?: number;
  label?: string;
}) {
  return (
    <div className={cn("marquee mask-fade-x relative overflow-hidden", className)} role="region" aria-label={label}>
      <div className="marquee-track flex" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-4 pr-4 md:gap-6 md:pr-6" aria-hidden={copy === 1 || undefined}>
            {items.map((item, i) => (
              <li key={i} className="shrink-0">
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
