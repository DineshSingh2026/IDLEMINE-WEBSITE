import { cn } from "@/lib/utils";

export type BadgeStatus = "live" | "done" | "progress" | "upcoming" | "alpha" | "neutral";

const styles: Record<BadgeStatus, string> = {
  live: "border-mint/30 bg-mint/10 text-mint",
  done: "border-mint/30 bg-mint/10 text-mint",
  progress: "border-gold/40 bg-gold/10 text-gold-2",
  upcoming: "border-line-strong bg-transparent text-ink-3",
  alpha: "border-violet/40 bg-violet/15 text-[#C4B2FF]",
  neutral: "border-line-strong bg-white/5 text-ink-2",
};
const dots: Partial<Record<BadgeStatus, string>> = {
  live: "bg-mint",
  done: "bg-mint",
  progress: "bg-gold pulse-dot",
  alpha: "bg-violet",
};

/** Small status pill: Live / Done / In progress (pulsing) / Upcoming / Alpha. */
export function Badge({ status = "neutral", children, className }: { status?: BadgeStatus; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em]",
        styles[status],
        className,
      )}
    >
      {dots[status] && <span aria-hidden className={cn("size-1.5 rounded-full", dots[status])} />}
      {children}
    </span>
  );
}
