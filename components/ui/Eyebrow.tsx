import { cn } from "@/lib/utils";

/** Uppercase 13px label with a small gold tick, e.g. "THE $IDLE ECOSYSTEM". */
export function Eyebrow({ children, className, dot = true }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <p className={cn("text-eyebrow inline-flex items-center gap-2.5", className)}>
      {dot && <span aria-hidden className="h-px w-5 bg-gradient-to-r from-gold to-gold/0" />}
      {children}
    </p>
  );
}
