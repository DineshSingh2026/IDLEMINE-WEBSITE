import { ArrowUpRight } from "lucide-react";
import { Badge, type BadgeStatus } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { roadmapStatusLabel, type Milestone, type RoadmapStatus } from "@/data/content/site";
import { cn } from "@/lib/utils";

export const badgeFor: Record<RoadmapStatus, BadgeStatus> = {
  done: "done",
  live: "progress",
  next: "upcoming",
  future: "upcoming",
};

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/** One roadmap phase: "Phase N" + status badge, optional date, name, copy, optional outbound link. */
export function MilestoneCard({ m, className }: { m: Milestone; className?: string }) {
  const live = m.status === "live";
  const done = m.status === "done";
  const upcoming = !live && !done;

  const body = (
    <div className="relative flex h-full flex-col">
      {/* Featured (current) phase: thin gradient-idle top rule — the only accent on the card */}
      {live && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-7 -top-7 h-px bg-[linear-gradient(90deg,#018082,#00C6C9_50%,#3DF5B0)] md:-inset-x-8 md:-top-8"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">Phase {m.phase}</span>
        <Badge status={badgeFor[m.status]}>{roadmapStatusLabel[m.status]}</Badge>
      </div>

      {m.date ? (
        <p className="mt-8 font-mono text-sm text-ink-2">
          <time dateTime={m.date}>{m.date}</time>
        </p>
      ) : (
        <span aria-hidden className="mt-8 block h-5" />
      )}

      <h3 className={cn("text-heading-m mt-2", upcoming ? "text-ink-2" : "text-ink")}>{m.name}</h3>
      <p className={cn("text-body mt-3 max-w-[34ch]", upcoming && "text-ink-3")}>{m.copy}</p>

      {m.url && (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-8 font-mono text-[13px] text-ink-2 transition-colors duration-200 ease-out group-hover:text-ink">
          {host(m.url)}
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      )}
    </div>
  );

  const cls = cn(
    "h-full min-h-[280px] p-7 md:p-8",
    live && "border-line-strong",
    upcoming && "bg-bg",
    className,
  );

  return (
    <Card href={m.url} padded={false} className={cls}>
      {body}
    </Card>
  );
}
