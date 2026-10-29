import { cn } from "@/lib/utils";

/** Pill chip: neutral glass by default; `tone` adds a colored dot. */
export function Chip({
  children,
  className,
  tone,
  icon,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "mint" | "violet";
  icon?: React.ReactNode;
}) {
  const dot = { gold: "bg-gold", mint: "bg-mint", violet: "bg-violet" };
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 text-sm font-medium text-ink-2 backdrop-blur-sm",
        className,
      )}
    >
      {tone && <span aria-hidden className={cn("size-1.5 rounded-full", dot[tone])} />}
      {icon}
      {children}
    </span>
  );
}
