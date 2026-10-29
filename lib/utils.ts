import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True for absolute http(s) links — those open in a new tab. */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
