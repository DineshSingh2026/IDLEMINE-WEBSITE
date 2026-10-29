"use client";

import useSWR from "swr";
import { EMPTY_STATS, type TokenStats } from "@/lib/token";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<TokenStats>;
  });

/** Live $IDLE market data, refreshed every 15s. Pass server-fetched stats as `initial` to avoid a flash of dashes. */
export function useTokenStats(initial?: TokenStats) {
  const { data, error, isLoading } = useSWR<TokenStats>("/api/token", fetcher, {
    refreshInterval: 15_000,
    fallbackData: initial,
    revalidateOnFocus: false,
  });
  return { stats: data ?? EMPTY_STATS, error, isLoading };
}
