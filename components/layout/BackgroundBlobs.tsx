"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type BlobColor = "gold" | "violet" | "mint" | "teal";
export type Blob = {
  color: BlobColor;
  /** CSS position, e.g. { top: "-10%", left: "60%" } */
  pos: React.CSSProperties;
  /** px diameter, default 560 */
  size?: number;
  /** 0–1, default 0.35 */
  opacity?: number;
};

const COLORS: Record<BlobColor, string> = {
  gold: "#F5C542",
  violet: "#9945FF",
  mint: "#14F195",
  teal: "#0FA3A0",
};

/** Blurred radial gradient blobs that drift at ~0.3× scroll speed (SPEC §2.6). */
export function BackgroundBlobs({ blobs, speed = 0.3, className }: { blobs: Blob[]; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 40}%`, `${speed * 40}%`]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        {blobs.map((b, i) => {
          const size = b.size ?? 560;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                ...b.pos,
                width: size,
                height: size,
                opacity: b.opacity ?? 0.35,
                background: `radial-gradient(circle at center, ${COLORS[b.color]} 0%, transparent 68%)`,
                filter: "blur(120px)",
                transform: "translate3d(-50%, -50%, 0)",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
