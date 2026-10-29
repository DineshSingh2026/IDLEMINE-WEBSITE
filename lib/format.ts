// Number formatting for live market data. Null/NaN always renders as an em dash.
const DASH = "—";
const ok = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n);

function compact(n: number) {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}

/** $0.0016213 — 5 significant figures */
export const fmtPrice = (n: number | null | undefined) =>
  ok(n) ? "$" + (n >= 1 ? n.toFixed(2) : Number(n.toPrecision(5)).toString()) : DASH;
/** $7.65M */
export const fmtUsd = (n: number | null | undefined) => (ok(n) ? "$" + compact(n) : DASH);
/** 4.80B IDLE */
export const fmtSupply = (n: number | null | undefined) => (ok(n) ? compact(n) + " IDLE" : DASH);
/** 12,345 */
export const fmtInt = (n: number | null | undefined) => (ok(n) ? Math.round(n).toLocaleString("en-US") : DASH);
/** ▲ 4.21% */
export const fmtPct = (n: number | null | undefined) =>
  ok(n) ? `${n >= 0 ? "▲" : "▼"} ${Math.abs(n).toFixed(2)}%` : DASH;

export type StatFormat = "price" | "usd" | "supply" | "int" | "pct";
export const formatters: Record<StatFormat, (n: number | null | undefined) => string> = {
  price: fmtPrice,
  usd: fmtUsd,
  supply: fmtSupply,
  int: fmtInt,
  pct: fmtPct,
};

export const truncateAddress = (a: string, head = 6, tail = 6) => `${a.slice(0, head)}…${a.slice(-tail)}`;
