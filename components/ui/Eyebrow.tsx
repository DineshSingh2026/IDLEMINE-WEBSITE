import { cn } from "@/lib/utils";

/** Uppercase mono section label in brand teal, e.g. "PRODUCTS". `dot` adds a small glowing brand dot. */
export function Eyebrow({ children, className, dot = false }: { children: React.ReactNode; className?: string; dot?: boolean }) {
  return (
    <p className={cn("text-eyebrow inline-flex items-center gap-2.5", className)}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_#00C6C9]" />}
      {children}
    </p>
  );
}
