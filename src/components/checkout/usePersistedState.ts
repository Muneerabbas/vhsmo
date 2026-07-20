"use client";

import { useEffect, useState } from "react";

/**
 * Like useState, but backed by sessionStorage so a value survives leaving the
 * page and coming back (e.g. a trip to a policy page mid-checkout). The stored
 * copy is scoped to the tab and cleared when the tab closes.
 *
 * Storage is read after mount rather than during the initial render, so the
 * server-rendered HTML and first client render agree (no hydration mismatch).
 */
export function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Load any persisted value once, after mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed / unavailable storage */
    }
    setHydrated(true);
  }, [key]);

  // Persist on change, but not before the initial load has run - otherwise the
  // default would clobber the stored value.
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
