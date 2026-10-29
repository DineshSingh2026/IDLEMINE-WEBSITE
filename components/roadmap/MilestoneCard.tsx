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
      {/* Oversized phase numeral, watermark */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-3 -top-6 select-none font-display text-[128px] font-bold leading-none tracking-[-0.06em]",
          live ? "text-gold/[0.09]" : "text-white/[0.035]",
        )}
      >
        {String(m.phase).padStart(2, "0")}
      </span>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-2">Phase {m.phase}</span>
        <Badge status={badgeFor[m.status]}>{roadmapStatusLabel[m.status]}</Badge>
      </div>

      {m.date ? (
        <p className={cn("mt-6 font-mono text-sm font-medium", done ? "text-mint" : "text-gold-2")}>
          <time dateTime={m.date}>{m.date}</time>
        </p>
      ) : (
        <span aria-hidden className="mt-6 block h-5" />
      )}

      <h3 className={cn("text-heading-m mt-2", upcoming ? "text-ink-2" : "text-ink")}>{m.name}</h3>
      <p className={cn("text-body mt-3 max-w-[34ch]", upcoming && "text-ink-3")}>{m.copy}</p>

      {m.url && (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-8 font-mono text-[13px] text-ink-2 transition-colors duration-300 group-hover:text-gold-2">
          {host(m.url)}
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-300 ease-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      )}
    </div>
  );

  const cls = cn(
    "h-full min-h-[300px] p-7 md:p-8",
    live &&
      "border-gold/35 bg-[linear-gradient(180deg,rgba(245,197,66,0.10),rgba(15,17,25,0.9)_55%)] shadow-[0_0_0_1px_rgba(245,197,66,0.08),0_30px_120px_-40px_rgba(245,197,66,0.45)]",
    done && "bg-[linear-gradient(180deg,rgba(20,241,149,0.06),rgba(15,17,25,0.9)_55%)]",
    upcoming && "bg-surface/60",
    className,
  );

  return (
    <Card href={m.url} padded={false} className={cls}>
      {body}
    </Card>
  );
}
