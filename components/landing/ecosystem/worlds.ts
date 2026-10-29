/**
 * Colour worlds for the three product chapters, built only from brand tokens:
 * Idlemine mint + teal, Idle Games teal + cyan (teal-300), Agent Games violet + teal.
 * There are no surfaces or borders: each world is only light (soft radial glows with no edges).
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
};

export const WORLDS: Record<WorldKey, World> = {
  mint: { a: "#3DF5B0", b: "#00C6C9", rgb: "61,245,176", rgb2: "0,198,201" },
  teal: { a: "#00C6C9", b: "#4DD9DB", rgb: "0,198,201", rgb2: "77,217,219" },
  violet: { a: "#9B7BFF", b: "#00C6C9", rgb: "155,123,255", rgb2: "0,198,201" },
};
