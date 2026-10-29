import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Warning-style callout (gold-tinted). */
export function Callout({ children, className, icon }: { children: React.ReactNode; className?: string; icon?: React.ReactNode }) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-4 rounded-lg border border-gold/30 bg-gradient-to-r from-gold/[0.08] to-gold/[0.02] p-5 text-[15px] leading-relaxed text-ink-2 md:p-6",
        className,
      )}
    >
      <span aria-hidden className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
        {icon ?? <ShieldAlert className="size-5" />}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
