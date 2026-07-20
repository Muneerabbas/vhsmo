/**
 * Deterministic pseudo-random helpers.
 *
 * The brand look leans on "intentionally imperfect" rotation and offsets.
 * Values must be stable between server and client render, so chaos is
 * seeded per-item instead of using Math.random().
 */
export function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Rotation in degrees within [-max, max], stable for a given seed.
 * Rounded to 3 decimals - React's SSR serializer truncates long floats
 * in style attributes, which would otherwise cause hydration mismatches.
 */
export function seededRotation(seed: number, max = 4): number {
  return Math.round((seeded(seed) * 2 - 1) * max * 1000) / 1000;
}
