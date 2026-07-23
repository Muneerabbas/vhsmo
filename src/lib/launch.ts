export const LAUNCH_TIME = new Date("2026-07-25T18:00:00+05:30");

export function hasLaunched() {
  return new Date() >= LAUNCH_TIME;
}
