import { cn } from "@/lib/utils";

/** Faint 32px dot grid at 40% that fades out at the section edges. */
export function DotGrid({ className }: { className?: string }) {
  return <div aria-hidden className={cn("dot-grid pointer-events-none absolute inset-0 opacity-40", className)} />;
}
