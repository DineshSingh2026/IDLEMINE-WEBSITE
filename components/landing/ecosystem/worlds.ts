/**
 * Colour worlds for the three product cards. Each product owns a gradient world built only from
 * brand tokens: Idlemine mint → teal, Idle Games teal → cyan (teal-300), Agent Games violet → teal.
 * Surfaces are deep tinted grounds (never neutral grey); `hover` is a stronger wash faded in on hover.
 */
export type WorldKey = "mint" | "teal" | "violet";

export type World = {
  /** primary accent */
  a: string;
  /** secondary accent */
  b: string;
  /** "r,g,b" of the primary accent, for rgba() mixes */
  rgb: string;
  /** "r,g,b" of the secondary accent */
  rgb2: string;
  surface: string;
  hover: string;
  border: string;
  ring: string;
  spot: string;
};

export const WORLDS: Record<WorldKey, World> = {
  mint: {
    a: "#3DF5B0",
    b: "#00C6C9",
    rgb: "61,245,176",
    rgb2: "0,198,201",
    surface:
      "radial-gradient(90% 70% at 88% 0%, rgba(61,245,176,0.22), transparent 60%), radial-gradient(80% 70% at 0% 100%, rgba(0,198,201,0.20), transparent 62%), linear-gradient(165deg, #0A2421 0%, #071816 42%, #061314 100%)",
    hover:
      "radial-gradient(70% 60% at 80% 10%, rgba(61,245,176,0.22), transparent 70%), radial-gradient(70% 60% at 10% 100%, rgba(0,198,201,0.22), transparent 70%)",
    border:
      "linear-gradient(140deg, rgba(61,245,176,0.75), rgba(0,198,201,0.28) 32%, rgba(0,198,201,0.10) 60%, rgba(61,245,176,0.45))",
    ring: "conic-gradient(from 0deg, transparent 0deg, transparent 210deg, #00C6C9 290deg, #3DF5B0 336deg, transparent 360deg)",
    spot: "radial-gradient(closest-side, rgba(61,245,176,0.24), rgba(0,198,201,0.10) 45%, transparent 100%)",
  },
  teal: {
    a: "#00C6C9",
    b: "#4DD9DB",
    rgb: "0,198,201",
    rgb2: "77,217,219",
    surface:
      "radial-gradient(90% 70% at 15% 0%, rgba(77,217,219,0.22), transparent 60%), radial-gradient(80% 70% at 100% 100%, rgba(0,198,201,0.22), transparent 62%), linear-gradient(195deg, #072226 0%, #06171B 45%, #051216 100%)",
    hover:
      "radial-gradient(70% 60% at 20% 10%, rgba(77,217,219,0.24), transparent 70%), radial-gradient(70% 60% at 90% 100%, rgba(0,198,201,0.24), transparent 70%)",
    border:
      "linear-gradient(220deg, rgba(77,217,219,0.75), rgba(0,198,201,0.28) 32%, rgba(0,198,201,0.10) 60%, rgba(77,217,219,0.45))",
    ring: "conic-gradient(from 0deg, transparent 0deg, transparent 210deg, #00C6C9 290deg, #B3F0F1 336deg, transparent 360deg)",
    spot: "radial-gradient(closest-side, rgba(77,217,219,0.24), rgba(0,198,201,0.10) 45%, transparent 100%)",
  },
  violet: {
    a: "#9B7BFF",
    b: "#00C6C9",
    rgb: "155,123,255",
    rgb2: "0,198,201",
    surface:
      "radial-gradient(80% 90% at 100% 0%, rgba(155,123,255,0.30), transparent 60%), radial-gradient(60% 80% at 0% 100%, rgba(0,198,201,0.16), transparent 65%), linear-gradient(160deg, #130F2A 0%, #0C0B1E 45%, #080B16 100%)",
    hover:
      "radial-gradient(70% 70% at 85% 10%, rgba(155,123,255,0.28), transparent 70%), radial-gradient(60% 70% at 5% 100%, rgba(0,198,201,0.20), transparent 70%)",
    border:
      "linear-gradient(150deg, rgba(0,198,201,0.45), rgba(155,123,255,0.20) 35%, rgba(155,123,255,0.12) 60%, rgba(155,123,255,0.80))",
    ring: "conic-gradient(from 0deg, transparent 0deg, transparent 210deg, #00C6C9 285deg, #9B7BFF 336deg, transparent 360deg)",
    spot: "radial-gradient(closest-side, rgba(155,123,255,0.28), rgba(0,198,201,0.08) 50%, transparent 100%)",
  },
};
