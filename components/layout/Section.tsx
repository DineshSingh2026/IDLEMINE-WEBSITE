import { cn } from "@/lib/utils";
import { BackgroundBlobs, type Blob } from "./BackgroundBlobs";
import { DotGrid } from "./DotGrid";
import { Grain } from "./Grain";
import { Container } from "./Container";

/**
 * Full-bleed section with the Solana-style background layer:
 * parallax blur blobs + optional dot grid + optional grain. Generous vertical rhythm.
 */
export function Section({
  id,
  className,
  containerClassName,
  blobs,
  dots = false,
  grain = false,
  bare = false,
  ariaLabelledby,
  children,
}: {
  id?: string;
  className?: string;
  containerClassName?: string;
  blobs?: Blob[];
  dots?: boolean;
  grain?: boolean;
  /** Skip the inner Container (for full-bleed content). */
  bare?: boolean;
  ariaLabelledby?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn("relative isolate py-16 md:py-24 lg:py-[120px]", className)}
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {blobs?.length ? <BackgroundBlobs blobs={blobs} /> : null}
        {dots ? <DotGrid /> : null}
        {grain ? <Grain /> : null}
      </div>
      {bare ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
