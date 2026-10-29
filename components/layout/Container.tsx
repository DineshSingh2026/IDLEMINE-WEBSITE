import { cn } from "@/lib/utils";

/** 1280px max, 24px gutter mobile / 48px desktop. */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("mx-auto w-full max-w-[1280px] px-6 lg:px-12", className)}>{children}</Tag>;
}
