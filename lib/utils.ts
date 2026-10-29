import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom type-scale utilities (globals.css @utility) so they are treated as
// font sizes — otherwise `text-display-l` and `text-ink` look like two colors and one gets dropped.
const twMerge = extendTailwindMerge<"text-grad">({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-xl", "display-l", "display-s", "heading-m", "heading-s", "body-l", "body", "eyebrow", "stat"] },
      ],
      "text-grad": [{ "text-grad": ["brand", "sol", "text"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True for absolute http(s) links — those open in a new tab. */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
